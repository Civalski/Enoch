import type { DestinacaoBlockPublic } from "@/lib/transparency-expense-data";

function Icon({ kind }: { kind: DestinacaoBlockPublic["icon"] }) {
  if (kind === "heart") {
    return (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    );
  }
  if (kind === "box") {
    return (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    );
  }
  return (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
    />
  );
}

const ring: Record<DestinacaoBlockPublic["gradient"], string> = {
  orange: "from-orange-500 to-orange-600",
  green: "from-green-500 to-green-600",
  red: "from-red-500 to-red-600",
  purple: "from-purple-500 to-purple-600",
};

const titleGrad: Record<DestinacaoBlockPublic["gradient"], string> = {
  orange: "from-orange-600 via-orange-700 to-orange-800",
  green: "from-green-600 via-green-700 to-green-800",
  red: "from-red-600 via-red-700 to-red-800",
  purple: "from-purple-600 via-purple-700 to-purple-800",
};

const barGrad: Record<DestinacaoBlockPublic["gradient"], string> = {
  orange: "from-orange-500 via-orange-600 to-orange-700",
  green: "from-green-500 via-green-600 to-green-700",
  red: "from-red-500 via-red-600 to-red-700",
  purple: "from-purple-500 via-purple-600 to-purple-700",
};

const pctGrad: Record<DestinacaoBlockPublic["gradient"], string> = {
  orange: "from-orange-600 to-orange-700",
  green: "from-green-600 to-green-700",
  red: "from-red-600 to-red-700",
  purple: "from-purple-600 to-purple-700",
};

function formatBrl(amount: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
}

type Props = {
  blocks: DestinacaoBlockPublic[];
};

export function TransparenciaDestinacao({ blocks }: Props) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {blocks.map((b) => (
          <div
            key={b.id}
            className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${ring[b.gradient]} rounded-full flex items-center justify-center shadow-lg flex-shrink-0`}
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <Icon kind={b.icon} />
                </svg>
              </div>
              <div className="flex-1">
                <h3
                  className={`text-xl font-bold bg-gradient-to-r ${titleGrad[b.gradient]} bg-clip-text text-transparent mb-1 drop-shadow-sm text-gradient-glow`}
                >
                  {b.title}
                </h3>
                <p className="text-sm bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent font-medium">
                  {b.subtitle}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent font-medium">
                  Percentual destinado
                </span>
                <span
                  className={`text-sm font-bold bg-gradient-to-r ${pctGrad[b.gradient]} bg-clip-text text-transparent`}
                >
                  {b.percent.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${barGrad[b.gradient]} h-2 rounded-full shadow-sm transition-all duration-500`}
                  style={{ width: `${Math.min(100, b.percent)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                Valor:{" "}
                <span className={`bg-gradient-to-r ${pctGrad[b.gradient]} bg-clip-text text-transparent font-semibold`}>
                  {formatBrl(b.amount)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
