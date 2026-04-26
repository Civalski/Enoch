"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicAboutTeamMember } from "@/lib/about-team-data";
import { DeleteAboutTeamMemberButton } from "@/components/site/DeleteAboutTeamMemberButton";
import { AboutTeamEditForm } from "@/components/site/AboutTeamEditForm";

type Props = {
  member: PublicAboutTeamMember;
  canManage: boolean;
};

export function AboutTeamMemberCard({ member, canManage }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const onCancel = useCallback(() => setIsEditing(false), []);

  if (!canManage) {
    return (
      <div className="text-center reveal">
        <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden group hover:scale-110 transition-transform duration-300 shadow-lg">
          <img
            src={member.imageUrl}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-sm text-gray-600">{member.roleTitle}</p>
      </div>
    );
  }

  if (isEditing) {
    return <AboutTeamEditForm member={member} onCancel={onCancel} />;
  }

  return (
    <div className="text-center reveal relative group/card">
      <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-lg">
        <img
          src={member.imageUrl}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
      <p className="text-sm text-gray-600">{member.roleTitle}</p>
      <div
        className="absolute -top-1 right-0 flex items-center gap-0.5 rounded-lg bg-white/95 p-0.5 shadow-md border border-slate-200/80"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-blue-600 hover:bg-blue-50"
          title="Editar"
          aria-label={`Editar «${member.name}»`}
          onClick={() => setIsEditing(true)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <DeleteAboutTeamMemberButton
          id={member.id}
          name={member.name}
          onDeleted={() => router.refresh()}
        />
      </div>
    </div>
  );
}
