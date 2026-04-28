import Link from "next/link";
import { redirect } from "next/navigation";
import { isMasterUser } from "@/lib/auth/admin-master";
import { resolvePublicBlogTenant } from "@/lib/blog-data";
import { requireServerUser } from "@/lib/auth/server";
import { getPrisma } from "@/lib/prisma";
import {
  getPublicSiteMembership,
  getSiteCapabilities,
} from "@/lib/permissions/site-permissions";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { InstitutionalEditorForm } from "@/components/app/InstitutionalEditorForm";
import { getInstitutionalContentForEditor } from "@/lib/institutional-site/public";

export default async function InstitucionalPage() {
  const user = await requireServerUser();
  const email = user.email?.trim();
  if (!email) {
    redirect("/admpainel");
  }
  await ensureUserProvisioning(user.id, email);
  const c = await getSiteCapabilities();
  if (!c.institutional) {
    if (!isMasterUser(user)) {
      redirect("/app");
    }
    const [publicT, m, tenantTotal] = await Promise.all([
      resolvePublicBlogTenant(),
      getPublicSiteMembership(user.id),
      getPrisma().tenant.count(),
    ]);
    return (
      <div className="max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Conteúdo do site — diagnóstico</h2>
        <p className="text-sm text-slate-600">
          A sua sessão é de administrador principal, mas neste ambiente não há permissão de edição institucional
          (membro do site público no tenant correcto). Isto explica a ausência de controlos de edição no site.
        </p>
        <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
          <li>
            Tenant público resolvido:{" "}
            <strong>
              {publicT ? `${publicT.slug} (${publicT.id})` : "não — defina BLOG_TENANT_SLUG ou mantenha um único tenant"}
            </strong>
          </li>
          <li>
            Membership no tenant público: <strong>{m ? "sim" : "não"}</strong>
          </li>
          <li>
            Total de tenants na base: <strong>{tenantTotal}</strong>
          </li>
        </ul>
        <p className="text-sm text-slate-600">
          Com vários tenants, defina <code className="text-xs bg-slate-100 px-1 rounded">BLOG_TENANT_SLUG</code> no
          ambiente de produção e garanta um registo <code className="text-xs bg-slate-100 px-1 rounded">TenantMember</code>{" "}
          para o <code className="text-xs bg-slate-100 px-1 rounded">SIMPLE_AUTH_USER_ID</code> nesse tenant. Pode correr{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">npm run check:site-admin</code> com a mesma{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">DATABASE_URL</code>.
        </p>
        <Link href="/" className="inline-block text-sm text-blue-600 hover:underline">
          Voltar ao início
        </Link>
      </div>
    );
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
