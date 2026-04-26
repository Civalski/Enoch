"use client";

import { useTransition } from "react";
import { deleteBlogPostAction } from "@/app/app/(backoffice)/blog/actions";

type Props = {
  postId: string;
  title: string;
  variant?: "text" | "icon";
};

export function DeleteBlogPostButton({ postId, title, variant = "text" }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      title="Eliminar artigo"
      aria-label={`Eliminar «${title}»`}
      disabled={isPending}
      className={
        variant === "icon"
          ? "inline-flex h-9 w-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          : "text-sm font-medium text-red-600 hover:text-red-800 underline-offset-2 hover:underline disabled:opacity-50"
      }
      onClick={() => {
        if (!window.confirm(`Eliminar o artigo «${title}»? Esta ação não pode ser anulada.`)) {
          return;
        }
        const fd = new FormData();
        fd.set("id", postId);
        startTransition(() => {
          void deleteBlogPostAction(fd);
        });
      }}
    >
      {variant === "icon" ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        "Eliminar"
      )}
    </button>
  );
}
