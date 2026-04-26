"use client";

import { useState, useEffect } from "react";

/** Botão que copia a URL pública do site (origem atual) para a área de transferência. */
export function ShareSiteLink() {
  const [copied, setCopied] = useState(false);
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    setSiteUrl(`${window.location.origin}/`);
  }, []);

  const copy = () => {
    if (!siteUrl) return;
    void navigator.clipboard.writeText(siteUrl).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => alert("Não foi possível copiar o link. Tente de novo ou copie manualmente."),
    );
  };

  return (
    <button
      type="button"
      onClick={copy}
      disabled={!siteUrl}
      className={`w-full inline-flex justify-center items-center text-center px-5 py-3 rounded-xl font-semibold transition-all shadow-md disabled:opacity-50 ${
        copied
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
      }`}
    >
      {copied ? "Link copiado!" : "Copiar link do site"}
    </button>
  );
}
