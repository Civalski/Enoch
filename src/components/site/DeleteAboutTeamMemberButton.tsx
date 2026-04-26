"use client";

import { useTransition } from "react";
import { deleteAboutTeamMemberAction } from "@/app/sobre/actions";

type Props = {
  id: string;
  name: string;
  onDeleted?: () => void;
};

export function DeleteAboutTeamMemberButton({ id, name, onDeleted }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      title="Eliminar membro"
      aria-label={`Eliminar «${name}»`}
      disabled={isPending}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
      onClick={() => {
        if (!window.confirm(`Eliminar o membro «${name}»? Esta ação não pode ser anulada.`)) {
          return;
        }
        const fd = new FormData();
        fd.set("id", id);
        startTransition(() => {
          void (async () => {
            try {
              await deleteAboutTeamMemberAction(fd);
              onDeleted?.();
            } catch (e) {
              window.alert(e instanceof Error ? e.message : "Não foi possível eliminar.");
            }
          })();
        });
      }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
