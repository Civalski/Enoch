import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { StudyResourceForm } from "@/components/app/StudyResourceForm";
import { requireServerUser } from "@/lib/auth/server";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { getPublicSiteMembership, memberHasSitePermission } from "@/lib/permissions/site-permissions";
import { getStudyForEdit } from "@/lib/study-data";
import type { Metadata } from "next";

type Params = { id: string };

export const metadata: Metadata = {
  title: "Editar material",
  robots: { index: false, follow: false },
};

export default async function EstudosEditarPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
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

  const study = await getStudyForEdit(m.tenantId, id);
  if (!study) {
    notFound();
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
        <h1 className="text-2xl font-bold text-slate-900 mt-4">Editar material</h1>
      </div>
      <StudyResourceForm
        mode="edit"
        values={{
          id: study.id,
          kind: study.kind,
          title: study.title,
          description: study.description ?? "",
          linkUrl: study.linkUrl ?? "",
        }}
      />
    </div>
  );
}
