"use client";

import { useState } from "react";

type Props = { pixKey: string };

export function PixCopyButton({ pixKey }: Props) {
  const [copied, setCopied] = useState(false);

  if (!pixKey.trim()) {
    return null;
  }

  const onClick = () => {
    navigator.clipboard.writeText(pixKey).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => alert("Não foi possível copiar a chave PIX. Por favor, copie manualmente."),
    );
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2 ${
        copied
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
      title="Copiar chave PIX"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copiado!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Copiar
        </>
      )}
    </button>
  );
}
