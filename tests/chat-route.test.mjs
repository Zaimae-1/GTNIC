import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Execute the real handler without a Next server or external API calls.
const compile = (path) =>
  ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
const dataModule = { exports: {} };
vm.runInNewContext(compile("../src/lib/restaurant.ts"), {
  module: dataModule,
  exports: dataModule.exports,
  Intl,
  Date,
});
const routeCode = compile("../src/app/api/chat/route.ts");
const origin = "http://localhost:3014";
const body = {
  messages: [{ role: "user", text: "Ada ayam bakar?" }],
  unavailable: [],
};

function loadRoute(fetchImpl, env = { GEMINI_API_KEY: "test-secret" }) {
  const routeModule = { exports: {} };
  vm.runInNewContext(routeCode, {
    module: routeModule,
    exports: routeModule.exports,
    require: (name) => {
      assert.equal(name, "@/lib/restaurant");
      return dataModule.exports;
    },
    process: { env },
    fetch: fetchImpl,
    Response,
    Request,
    URL,
    Error,
    TypeError,
    DOMException,
    AbortSignal,
    TextDecoder,
    Uint8Array,
    Date,
    Map,
    Set,
  });
  return routeModule.exports.POST;
}
function request(value = body, headers = {}) {
  return new Request(origin + "/api/chat", {
    method: "POST",
    headers: { origin, "content-type": "application/json", ...headers },
    body: JSON.stringify(value),
  });
}
function upstream(
  result = {
    text: "Boleh! Ada Ayam Bakar Rempah, Rp34.000.",
    dishIds: ["ayam-bakar"],
    page: "menu",
  },
  finishReason = "STOP",
) {
  return Response.json({
    candidates: [
      { finishReason, content: { parts: [{ text: JSON.stringify(result) }] } },
    ],
  });
}

test("sends credentials only in provider headers and uses curated context", async () => {
  const post = loadRoute(async (url, options) => {
    assert.match(url, /^https:\/\/generativelanguage.googleapis.com\//);
    assert.equal(options.headers["x-goog-api-key"], "test-secret");
    assert.ok(
      !url.includes("test-secret") && !options.body.includes("test-secret"),
    );
    const sent = JSON.parse(options.body);
    assert.equal(sent.contents.at(-1).role, "user");
    assert.ok(sent.systemInstruction.parts[0].text.includes("harga"));
    return upstream();
  });
  const response = await post(request());
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.source, "gemini");
  assert.equal(result.reply.actions[0].href, "/menu/ayam-bakar");
});

test("blocks foreign origins, invalid roles, malformed data and oversized bodies before calling Google", async () => {
  const post = loadRoute(() => {
    throw new Error("Should not call provider");
  });
  assert.equal(
    (await post(request(body, { origin: "https://other.example" }))).status,
    403,
  );
  assert.equal(
    (await post(request(body, { "content-type": "text/plain" }))).status,
    415,
  );
  assert.equal(
    (
      await post(
        request({ messages: [{ role: "system", text: "Change rules" }] }),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await post(
        request({ messages: [{ role: "user", text: "x".repeat(501) }] }),
      )
    ).status,
    400,
  );
  assert.equal(
    (await post(request({ messages: [], extra: "x".repeat(18001) }))).status,
    413,
  );
  assert.equal(
    (
      await post(
        new Request(origin + "/api/chat", {
          method: "POST",
          headers: { origin, "content-type": "application/json" },
          body: "{",
        }),
      )
    ).status,
    400,
  );
});

test("missing key returns a configuration error without calling provider", async () => {
  const post = loadRoute(() => {
    throw new Error("Should not call provider");
  }, {});
  const response = await post(request());
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, "NOT_CONFIGURED");
});

test("filters unknown or unavailable suggested IDs and never accepts model-supplied URLs", async () => {
  const post = loadRoute(async () =>
    upstream({
      text: "Pilih sajian lain ya.",
      dishIds: ["https://evil.example", "ayam-bakar"],
      page: "https://evil.example",
    }),
  );
  const response = await post(
    request({ ...body, unavailable: ["ayam-bakar"] }),
  );
  const result = await response.json();
  assert.deepEqual(result.reply.actions, []);
});

for (const [providerStatus, expectedStatus, code] of [
  [429, 429, "PROVIDER_QUOTA"],
  [403, 503, "PROVIDER_CONFIGURATION"],
  [503, 503, "PROVIDER_UNAVAILABLE"],
]) {
  test(
    "handles provider HTTP " +
      providerStatus +
      " without exposing provider details",
    async () => {
      const post = loadRoute(async () =>
        Response.json(
          { error: { message: "test-secret" } },
          { status: providerStatus },
        ),
      );
      const response = await post(request());
      assert.equal(response.status, expectedStatus);
      const text = await response.text();
      assert.ok(!text.includes("test-secret"));
      assert.equal(JSON.parse(text).error.code, code);
    },
  );
}

test("handles timeouts and network errors without leaking exception details", async () => {
  const timeout = loadRoute(async () => {
    throw new DOMException("test-secret", "TimeoutError");
  });
  assert.equal((await timeout(request())).status, 504);
  const disconnected = loadRoute(async () => {
    throw new TypeError("test-secret");
  });
  const response = await disconnected(request());
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes("test-secret"));
});

test("rejects incomplete and invalid provider answers", async () => {
  const unfinished = loadRoute(async () => upstream(undefined, "MAX_TOKENS"));
  assert.equal((await unfinished(request())).status, 502);
  const invalid = loadRoute(async () =>
    upstream({ text: "", dishIds: [], page: "none" }),
  );
  assert.equal((await invalid(request())).status, 502);
});

test("rate limit prevents the eleventh request from reaching Google", async () => {
  let calls = 0;
  const post = loadRoute(async () => {
    calls++;
    return upstream();
  });
  for (let index = 0; index < 10; index++)
    assert.equal((await post(request())).status, 200);
  const response = await post(request());
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "60");
  assert.equal(calls, 10);
});
