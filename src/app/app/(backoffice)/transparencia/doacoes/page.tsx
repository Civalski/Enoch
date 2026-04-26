import Link from "next/link";
import { redirect } from "next/navigation";
import { DonationCreateForm } from "@/components/app/DonationCreateForm";
import { TransparencyExpenseCreateForm } from "@/components/app/TransparencyExpenseCreateForm";
import {
  TransparencyDonationsManage,
  type TransparencyDonationRow,
} from "@/components/app/TransparencyDonationsManage";
import {
  TransparencyExpensesManage,
  type TransparencyExpenseRow,
} from "@/components/app/TransparencyExpensesManage";
import { requireServerUser } from "@/lib/auth/server";
import { ensureUserProvisioning } from "@/lib/tenant/provisioning";
import { getSiteCapabilities, requirePublicSiteContext } from "@/lib/permissions/site-permissions";
import { prisma } from "@/lib/prisma";

export default async function CadastroDoacoesPage() {
  const user = await requireServerUser();
  const email = user.email?.trim();
  if (!email) {
    redirect("/admpainel");
  }
  await ensureUserProvisioning(user.id, email);
  const c = await getSiteCapabilities();
  if (!c.transparency) {
    redirect("/transparencia");
  }

  const { tenantId } = await requirePublicSiteContext();
  const [donationRows, expenseRows] = await Promise.all([
    prisma.donation.findMany({
      where: { tenantId },
      orderBy: { donatedAt: "desc" },
      take: 200,
    }),
    prisma.transparencyExpense.findMany({
      where: { tenantId },
      orderBy: { spentAt: "desc" },
      take: 200,
    }),
  ]);

  const donations: TransparencyDonationRow[] = donationRows.map((d) => ({
    id: d.id,
    donorName: d.donorName,
    amount: d.amount.toString(),
    donatedAtMs: d.donatedAt.getTime(),
  }));

  const expenses: TransparencyExpenseRow[] = expenseRows.map((e) => ({
    id: e.id,
    category: e.category,
    amount: e.amount.toString(),
    spentAtMs: e.spentAt.getTime(),
    description: e.description,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-3">
        <Link
          href="/transparencia"
          className="inline-block text-sm font-medium text-blue-600 underline-offset-2 hover:underline"
        >
          ← Voltar à transparência
        </Link>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Transparência — receitas e despesas
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          Os valores aparecem na página pública de transparência para o tenant ativo no painel. Use o mesmo
          tenant da organização que alimenta o blog institucional.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/90 px-5 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">Registar doação (receita)</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              A doação entra no resumo e na lista pública de contribuintes, organizada por mês.
            </p>
          </div>
          <div className="min-h-0 flex-1 space-y-6 p-5 sm:p-6">
            <DonationCreateForm />
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-sm font-semibold text-slate-900">Doações registadas</h4>
              <p className="mt-1 text-sm text-slate-600">
                Edite ou apague registos quando precisar corrigir valores ou duplicados (até 200 mais recentes).
              </p>
              <div className="mt-4">
                <TransparencyDonationsManage donations={donations} />
              </div>
            </div>
          </div>
        </section>
        <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/90 px-5 py-4 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">Registar despesa (destinação)</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Cada registo alimenta o extrato mensal e os percentuais por categoria na secção «Destinação das
              Doações».
            </p>
          </div>
          <div className="min-h-0 flex-1 space-y-6 p-5 sm:p-6">
            <TransparencyExpenseCreateForm />
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-sm font-semibold text-slate-900">Despesas registadas</h4>
              <p className="mt-1 text-sm text-slate-600">
                Edite ou apague quando precisar corrigir categorias ou valores (até 200 mais recentes).
              </p>
              <div className="mt-4">
                <TransparencyExpensesManage expenses={expenses} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
