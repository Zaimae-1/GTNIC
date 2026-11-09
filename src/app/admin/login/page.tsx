"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonLink, Notice, PageTitle } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/supabase/env";

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function signIn(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const client = createClient();
      const { data, error } = await client.auth.signInWithPassword({
        email: String(form.get("email")).trim(),
        password: String(form.get("password")),
      });
      if (error || !data.user) throw new Error("Email atau kata sandi staf tidak dapat diverifikasi.");
      const { data: staff } = await client.from("saji_reservation_staff")
        .select("user_id").eq("user_id", data.user.id).maybeSingle();
      if (!staff) {
        await client.auth.signOut({ scope: "local" });
        throw new Error("Akun ini belum memiliki akses staf.");
      }
      router.push("/admin");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="container inner-page auth-page">
      <PageTitle label="AKSES STAF" title="Masuk ke panel staf."
        description="Gunakan akun staf untuk melihat dan memperbarui reservasi." />
      {hasSupabaseConfig ? (
        <form className="panel form-section" onSubmit={signIn}>
          <label className="field">Email staf
            <input name="email" type="email" autoComplete="username" required />
          </label>
          <label className="field">Kata sandi
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {error && <p role="alert" className="form-error">{error}</p>}
          <button className="button" disabled={pending}>{pending ? "Memeriksa…" : "Masuk"}</button>
        </form>
      ) : <>
        <Notice>Panel berjalan dalam mode simulasi lokal.</Notice>
        <ButtonLink href="/admin">Buka panel simulasi</ButtonLink>
      </>}
    </div>
  );
}
