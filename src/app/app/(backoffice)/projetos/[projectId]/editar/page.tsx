import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireServerUser } from "@/lib/auth/server";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { getPublicSiteMembership, getSiteCapabilities } from "@/lib/permissions/site-permissions";
import { ProjectForm } from "@/components/app/ProjectForm";
import { getProjectForEdit } from "@/lib/project-data";

type Params = { projectId: string };

export default async function EditarProjetoPage({ params }: { params: Promise<Params> }) {
  const { projectId } = await params;
  const user = await requireServerUser();
  const email = user.email ?? "";
  if (!email) {
    return null;
  }
  await ensureUserProvisioning(user.id, email);
  const c = await getSiteCapabilities();
  if (!c.projects) {
    redirect("/projetos");
  }
  const m = await getPublicSiteMembership(user.id);
  if (!m) {
    notFound();
  }

  const project = await getProjectForEdit(m.tenantId, projectId);
  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/projetos"
          className="text-sm text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
        >
          ← Voltar aos projetos
        </Link>
        <h2 className="text-lg font-semibold text-slate-900 mt-4">Editar projeto</h2>
      </div>
      <ProjectForm
        mode="edit"
        values={{
          id: project.id,
          title: project.title,
          description: project.description,
          imageUrl: project.imageUrl,
          displayOrder: String(project.displayOrder),
        }}
      />
    </div>
  );
}
