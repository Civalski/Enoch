import type { Metadata } from "next";
import { Section } from "@/components/site/Section";
import { TransparenciaResumo } from "@/components/site/transparencia/TransparenciaResumo";
import { TransparenciaDoacoes } from "@/components/site/transparencia/TransparenciaDoacoes";
import { TransparenciaExtratos } from "@/components/site/transparencia/TransparenciaExtratos";
import { TransparenciaDestinacao } from "@/components/site/transparencia/TransparenciaDestinacao";
import { TransparenciaCompromisso } from "@/components/site/transparencia/TransparenciaCompromisso";
import { getDonationsTransparencyPayload } from "@/lib/donations-data";
import { getSiteCapabilities } from "@/lib/permissions/site-permissions";
import { getTransparencyExpenseViews } from "@/lib/transparency-expense-data";

export const metadata: Metadata = {
  title: "Transparência",
  description: "Transparência financeira da A.R.L.S Enoch - Extratos e destinação das doações",
};

export default async function TransparenciaPage() {
  const donations = await getDonationsTransparencyPayload();
  const [caps, expenseViews] = await Promise.all([
    getSiteCapabilities(),
    getTransparencyExpenseViews(donations.months),
  ]);
  const { transparency: canManage } = caps;

  return (
    <>
      <section className="gradient-animated text-white py-20 relative overflow-hidden particles-bg">
        <div className="absolute inset-0 bg-gradient-blue-subtle opacity-90" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up text-white drop-shadow-lg">
            Transparência
          </h1>
          <p
            className="text-xl text-blue-100 animate-fade-in-up drop-shadow-md"
            style={{ animationDelay: "0.2s" }}
          >
            Acompanhe como utilizamos os recursos recebidos através das doações
          </p>
        </div>
      </section>

      <Section
        title="Resumo Financeiro"
        subtitle="Visão geral dos recursos recebidos e destinados"
        className="bg-white"
      >
        <TransparenciaResumo
          totalDoacoes6Meses={donations.totalLast6Months}
          totalDespesas6Meses={expenseViews.totalDespesasPeriod}
          periodoDoacoesLabel={donations.periodLabel}
        />
      </Section>

      <Section
        title="Doações"
        subtitle="Totais por mês nos últimos seis meses; expanda para ver quem contribuiu"
        className="bg-gray-50"
      >
        <TransparenciaDoacoes months={donations.months} canManage={canManage} />
      </Section>

      <Section
        title="Extratos Mensais"
        subtitle="Detalhamento mensal das receitas e despesas"
        className="bg-white"
      >
        <TransparenciaExtratos rows={expenseViews.extratoRows} canManage={canManage} />
      </Section>

      <Section
        title="Destinação das Doações"
        subtitle="Como os recursos são aplicados em nossos projetos e ações"
        className="bg-gray-50"
      >
        <TransparenciaDestinacao blocks={expenseViews.destinacaoBlocks} />
      </Section>

      <Section title="Nosso Compromisso" className="bg-white">
        <TransparenciaCompromisso />
      </Section>
    </>
  );
}
