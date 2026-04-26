"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollRevealAndGuards() {
  const pathname = usePathname();

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const blockMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    const blockKeys = (e: KeyboardEvent) => {
      if (e.key === "F12") e.preventDefault();
      if (e.ctrlKey && e.shiftKey && e.key === "I") e.preventDefault();
      if (e.ctrlKey && e.shiftKey && e.key === "J") e.preventDefault();
      if (e.ctrlKey && e.key === "u") e.preventDefault();
    };
    document.addEventListener("contextmenu", blockMenu);
    document.addEventListener("keydown", blockKeys);
    return () => {
      document.removeEventListener("contextmenu", blockMenu);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  return null;
}
