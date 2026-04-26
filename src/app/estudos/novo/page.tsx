import Link from "next/link";
import { redirect } from "next/navigation";
import { StudyResourceForm } from "@/components/app/StudyResourceForm";
import { requireServerUser } from "@/lib/auth/server";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { getPublicSiteMembership, memberHasSitePermission } from "@/lib/permissions/site-permissions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novo material",
  robots: { index: false, follow: false },
};

export default async function EstudosNovoPage() {
  const user = await requireServerUser();
  const email = user.email?.trim();
  if (!email) {
    redirect("/estudos");
  }
  await ensureUserProvisioning(user.id, email);
  const m = await getPublicSiteMembership(user.id);
  if (!m || !memberHasSitePermission(m.role, m.permissions, "INSTITUTIONAL")) {
    redirect("/estudos");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/estudos"
          className="text-sm text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
        >
          ← Voltar a Estudos
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-4">Novo material</h1>
        <p className="text-slate-600 text-sm mt-2">
          Indique título, descrição e uma ligação (por exemplo, Google Drive) para o visitante abrir
          ou descarregar o ficheiro.
        </p>
      </div>
      <StudyResourceForm mode="create" />
    </div>
  );
}
