import Link from "next/link";
import { redirect } from "next/navigation";
import { requireServerUser } from "@/lib/auth/server";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { getSiteCapabilities } from "@/lib/permissions/site-permissions";
import { ProjectForm } from "@/components/app/ProjectForm";
import { getStaticProjectByTitle } from "@/lib/projects-static";

type SearchParams = Promise<{ exemploTitle?: string }>;

export default async function NovoProjetoPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireServerUser();
  const email = user.email?.trim();
  if (!email) {
    redirect("/projetos");
  }
  await ensureUserProvisioning(user.id, email);
  const c = await getSiteCapabilities();
  if (!c.projects) {
    redirect("/projetos");
  }

  const { exemploTitle: exemploRaw } = await searchParams;
  const exemploTitle = typeof exemploRaw === "string" ? decodeURIComponent(exemploRaw.trim()) : "";
  const exemplo = exemploTitle ? getStaticProjectByTitle(exemploTitle) : undefined;
  const createPrefill = exemplo
    ? {
        title: exemplo.title,
        description: exemplo.description,
        imageUrl: exemplo.image,
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/projetos"
          className="text-sm text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
        >
          ← Voltar aos projetos
        </Link>
        <h2 className="text-lg font-semibold text-slate-900 mt-4">Novo projeto</h2>
        {createPrefill && (
          <p className="mt-2 text-sm text-slate-600">
            Formulário pré-preenchido a partir do texto de exemplo «{createPrefill.title}». Guarde para
            criar o registo na base.
          </p>
        )}
      </div>
      <ProjectForm mode="create" createPrefill={createPrefill} />
    </div>
  );
}
