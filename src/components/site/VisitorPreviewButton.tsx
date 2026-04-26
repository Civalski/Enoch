"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setVisitorPreviewAction } from "@/lib/visitor-preview-actions";

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

type Props = {
  active: boolean;
};

export function VisitorPreviewButton({ active }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        start(async () => {
          const r = await setVisitorPreviewAction(active ? "off" : "on");
          if (r.ok) {
            router.refresh();
          }
        });
      }}
      className={
        active
          ? "inline-flex items-center justify-center rounded-md p-2 bg-violet-100 text-violet-800 ring-2 ring-violet-300 hover:bg-violet-200 transition-colors"
          : "inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-violet-700 hover:bg-gray-50 transition-colors"
      }
      title={active ? "Sair do modo visitante (voltar a ver como editor)" : "Ver o site como visitante (não autenticado)"}
      aria-pressed={active}
      aria-label={active ? "Sair do modo visitante" : "Ver o site como visitante"}
    >
      <EyeIcon className="h-5 w-5" />
    </button>
  );
}
