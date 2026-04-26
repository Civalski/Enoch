function formatBrl(amount: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
}

type Props = {
  totalDoacoes6Meses: number;
  totalDespesas6Meses: number;
  periodoDoacoesLabel: string;
};

export function TransparenciaResumo({
  totalDoacoes6Meses,
  totalDespesas6Meses,
  periodoDoacoesLabel,
}: Props) {
  const pctDoacoes =
    totalDoacoes6Meses > 0
      ? Math.min(100, Math.round((totalDespesas6Meses / totalDoacoes6Meses) * 1000) / 10)
      : null;
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-semibold mb-2">
            Doações recebidas
          </h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent drop-shadow-sm text-gradient-glow">
            {formatBrl(totalDoacoes6Meses)}
          </p>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            Últimos 6 meses:{" "}
            <span className="bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent font-semibold">
              {periodoDoacoesLabel}
            </span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent font-semibold mb-2">
            Total aplicado (despesas)
          </h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-sm text-gradient-glow">
            {formatBrl(totalDespesas6Meses)}
          </p>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            {pctDoacoes != null ? (
              <>
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent font-semibold">
                  {pctDoacoes.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}%
                </span>{" "}
                das doações recebidas no período
              </>
            ) : totalDespesas6Meses > 0 ? (
              <span className="bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent font-semibold">
                Despesas registadas; sem doações no mesmo período.
              </span>
            ) : (
              <span className="bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent font-semibold">
                Nenhuma despesa registada no período.
              </span>
            )}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-semibold mb-2">
            Beneficiados
          </h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent drop-shadow-sm text-gradient-glow">
            0
          </p>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-semibold">
              Famílias atendidas
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
