import Link from "next/link";
import { redirect } from "next/navigation";
import { requireServerUser } from "@/lib/auth/server";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { getSiteCapabilities } from "@/lib/permissions/site-permissions";
import { getInstitutionalContentForEditor } from "@/lib/institutional-site/public";
import { InstitutionalEditorForm } from "@/components/app/InstitutionalEditorForm";

export default async function InstitucionalPage() {
  const user = await requireServerUser();
  const email = user.email?.trim();
  if (!email) {
    redirect("/admpainel");
  }
  await ensureUserProvisioning(user.id, email);
  const c = await getSiteCapabilities();
  if (!c.institutional) {
    redirect("/app");
  }

  const editor = await getInstitutionalContentForEditor();
  if (!editor) {
    return (
      <div className="max-w-2xl space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Conteúdo do site</h2>
        <p className="text-sm text-slate-600">
          Não foi possível resolver o site público. Defina <code className="text-xs">BLOG_TENANT_SLUG</code> no
          ambiente ou mantenha um único tenant na base.
        </p>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Dados da entidade</h2>
        <p className="mt-1 text-sm text-slate-600 max-w-2xl">
          Apenas definições gerais: texto e copyright do rodapé, dados de contacto, redes sociais e URL do mapa na
          página inicial. O nome, logótipo e textos em destaque no site editam-se no próprio sítio (cabeçalho,
          Estudos, contacto, blog, menu, etc.).
        </p>
      </div>
      <InstitutionalEditorForm site={editor.view} />
    </div>
  );
}
