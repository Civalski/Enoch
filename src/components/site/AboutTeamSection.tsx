"use client";

import { useCallback, useState } from "react";
import type { PublicAboutTeamMember } from "@/lib/about-team-data";
import { AboutTeamAddForm } from "@/components/site/AboutTeamAddForm";
import { AboutTeamMemberCard } from "@/components/site/AboutTeamMemberCard";

type Props = {
  members: PublicAboutTeamMember[];
  canManage: boolean;
};

export function AboutTeamSection({ members, canManage }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const closeAdd = useCallback(() => setShowAdd(false), []);

  return (
    <div>
      {canManage && (
        <div className="flex justify-center md:justify-end mb-6">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
            onClick={() => setShowAdd((s) => !s)}
            aria-expanded={showAdd}
          >
            {showAdd ? "Fechar formulário" : "Adicionar membro"}
          </button>
        </div>
      )}

      {canManage && showAdd ? <AboutTeamAddForm onClose={closeAdd} /> : null}

      {members.length === 0 ? (
        <p className="text-center text-slate-600 text-sm max-w-lg mx-auto">
          {canManage
            ? "Ainda não há membros publicados. Use «Adicionar membro» para criar a equipa no site."
            : "A equipa da instituição será divulgada em breve."}
        </p>
      ) : (
        <div className="grid md:grid-cols-4 gap-8">
          {members.map((m) => (
            <AboutTeamMemberCard key={m.id} member={m} canManage={canManage} />
          ))}
        </div>
      )}
    </div>
  );
}
