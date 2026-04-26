"use client";

import type { MergedProject } from "@/lib/project-data";
import { ProjectAdminControls } from "@/components/site/ProjectAdminControls";
import { ProjectStaticAdminControls } from "@/components/site/ProjectStaticAdminControls";

type Props = {
  projects: MergedProject[];
  canManage: boolean;
};

export function ProjetosCardsGrid({ projects, canManage }: Props) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((p) => {
        const key = p.dbId ?? p.title;
        const showDb = Boolean(canManage && p.dbId);
        const showStatic = Boolean(canManage && !p.dbId);
        return (
          <div
            key={key}
            className="glass-card rounded-2xl overflow-hidden hover-lift group transition-all duration-300 relative"
          >
            <div className="w-full h-56 bg-gray-200 overflow-hidden relative">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 mb-3 group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-300">
                {p.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{p.description}</p>
            </div>
            {showDb && p.dbId && (
              <div className="absolute top-3 right-3 z-30">
                <ProjectAdminControls projectId={p.dbId} title={p.title} />
              </div>
            )}
            {showStatic && (
              <div className="absolute top-3 right-3 z-30">
                <ProjectStaticAdminControls title={p.title} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
