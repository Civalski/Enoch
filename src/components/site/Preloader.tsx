"use client";

import { useEffect } from "react";

type Props = { logoUrl: string; orgName: string };

export function Preloader({ logoUrl, orgName }: Props) {
  useEffect(() => {
    const el = document.getElementById("preloader");
    const hide = () => {
      if (!el) return;
      el.style.opacity = "0";
      setTimeout(() => {
        el.style.display = "none";
      }, 300);
    };
    const t = window.setTimeout(hide, 1000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: "#preloader{display:none!important}" }} />
      </noscript>
      <div
        id="preloader"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity duration-300"
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-700 border-l-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-blue-300 border-b-transparent border-l-blue-600 animate-spin-reverse" />
            <div className="absolute inset-1 flex items-center justify-center rounded-full bg-white p-1.5">
              <img
                src={logoUrl}
                alt={`${orgName} — logótipo`}
                className="h-full w-full object-contain rounded-full"
              />
            </div>
          </div>
          <div className="text-blue-500 font-medium tracking-[0.2em] text-sm uppercase animate-pulse">
            Carregando
          </div>
        </div>
      </div>
    </>
  );
}
