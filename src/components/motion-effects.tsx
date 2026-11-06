"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelector =
  ".section-heading, .menu-card, .story-photo, .story-copy, .occasion-card, .visit-info, .form-section";

export function MotionEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const main = document.getElementById("main");
    if (preference.matches || !main || !("IntersectionObserver" in window))
      return;

    const seen = new WeakSet<Element>();
    const running = new Set<Animation>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (preference.matches) continue;
          const siblings = Array.from(
            entry.target.parentElement?.children ?? [],
          );
          const delay = Math.max(0, siblings.indexOf(entry.target) % 3) * 35;
          const animation = entry.target.animate(
            [
              { opacity: 0.82, translate: "0 6px" },
              { opacity: 1, translate: "0 0" },
            ],
            {
              duration: 640,
              delay,
              easing: "cubic-bezier(.25, .65, .3, 1)",
              fill: "backwards",
            },
          );
          running.add(animation);
          animation.onfinish = animation.oncancel = () =>
            running.delete(animation);
        }
      },
      { threshold: 0, rootMargin: "0px 0px 40px 0px" },
    );

    function observe(root: Element) {
      const targets = [
        ...(root.matches(revealSelector) ? [root] : []),
        ...root.querySelectorAll(revealSelector),
      ];
      for (const target of targets) {
        if (seen.has(target)) continue;
        seen.add(target);
        // Already-visible content stays in place instead of flashing after hydration.
        if (target.getBoundingClientRect().top < window.innerHeight) continue;
        observer.observe(target);
      }
    }
    observe(main);
    const changes = new MutationObserver((records) => {
      for (const record of records)
        for (const node of record.addedNodes)
          if (node instanceof Element) observe(node);
    });
    changes.observe(main, { childList: true, subtree: true });

    function stopMotion() {
      if (preference.matches)
        for (const animation of running) animation.cancel();
    }
    preference.addEventListener("change", stopMotion);
    return () => {
      observer.disconnect();
      changes.disconnect();
      preference.removeEventListener("change", stopMotion);
      for (const animation of running) animation.cancel();
    };
  }, [pathname]);

  return null;
}
