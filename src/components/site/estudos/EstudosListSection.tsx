import Link from "next/link";
import { StudyResourceAdminControls } from "@/components/site/StudyResourceAdminControls";
import {
  buildEstudosListUrl,
  type PublicStudyItem,
  type StudyResourcesPageResult,
} from "@/lib/study-list-public";
import { type StudyResourceKind } from "@/lib/study-kinds-constants";

const KIND_TAG: Record<StudyResourceKind, string> = {
  artigo: "Artigo",
  livro: "Livro",
  video: "Vídeo",
  material_educacional: "Material",
};

const FILTERS: { id: StudyResourceKind | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "artigo", label: "Artigos" },
  { id: "livro", label: "Livros" },
  { id: "video", label: "Vídeos" },
  { id: "material_educacional", label: "Materiais" },
];

type Props = {
  result: StudyResourcesPageResult;
  filterKind: StudyResourceKind | undefined;
  canManage: boolean;
};

export function EstudosListSection({ result, filterKind, canManage }: Props) {
  const { items, totalCount, totalInTenant, page, pageSize } = result;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize) || 1);
  const showKindColumn = filterKind === undefined;

  return (
    <div>
      <div
        className="flex flex-wrap gap-1.5 mb-6"
        role="group"
        aria-label="Filtrar por tipo de material"
      >
        {FILTERS.map((f) => {
          const active =
            f.id === "all" ? filterKind === undefined : filterKind === f.id;
          const href = buildEstudosListUrl({
            kind: f.id === "all" ? undefined : f.id,
            page: 1,
          });
          return (
            <Link
              key={f.id === "all" ? "all" : f.id}
              href={href}
              scroll={false}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500 py-6 border border-dashed border-slate-200 rounded-lg text-center">
          {totalInTenant === 0
            ? "Ainda não há materiais. Quando a equipa adicionar itens, eles surgem aqui."
            : "Não há itens com este filtro. Experimente outra categoria ou use «Todos»."}
        </p>
      ) : (
        <>
          <ul
            className="border border-slate-200 rounded-lg bg-white overflow-hidden"
            aria-label="Lista de materiais de estudo"
          >
            {items.map((it) => (
              <li
                key={it.id}
                className="group flex w-full min-h-[48px] items-stretch border-b border-slate-100 last:border-b-0 hover:bg-slate-50/80 transition-colors"
              >
                {it.linkUrl ? (
                  <a
                    href={it.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5 no-underline text-slate-900"
                  >
                    <RowContent it={it} showKindBadge={showKindColumn} />
                  </a>
                ) : (
                  <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5 text-slate-600">
                    <RowContent it={it} showKindBadge={showKindColumn} missingLink />
                  </div>
                )}
                {canManage ? (
                  <div className="flex shrink-0 items-center pr-2 border-l border-slate-100 bg-slate-50/50 pl-1">
                    <StudyResourceAdminControls studyId={it.id} title={it.title} />
                  </div>
                ) : null}
              </li>
            ))}
          </ul>

          {totalPages > 1 ? (
            <nav
              className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-600"
              aria-label="Paginação"
            >
              <p>
                Página <span className="font-medium text-slate-900">{page}</span> de{" "}
                <span className="font-medium text-slate-900">{totalPages}</span>
                <span className="text-slate-400"> · </span>
                {totalCount} {totalCount === 1 ? "item" : "itens"}
              </p>
              <div className="flex items-center gap-2">
                {page > 1 ? (
                  <Link
                    href={buildEstudosListUrl({ kind: filterKind, page: page - 1 })}
                    scroll={false}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-800 hover:bg-slate-50"
                  >
                    Anterior
                  </Link>
                ) : (
                  <span className="rounded-md border border-transparent px-3 py-1.5 text-slate-300 cursor-not-allowed">
                    Anterior
                  </span>
                )}
                {page < totalPages ? (
                  <Link
                    href={buildEstudosListUrl({ kind: filterKind, page: page + 1 })}
                    scroll={false}
                    className="rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-800 hover:bg-slate-50"
                  >
                    Seguinte
                  </Link>
                ) : (
                  <span className="rounded-md border border-transparent px-3 py-1.5 text-slate-300 cursor-not-allowed">
                    Seguinte
                  </span>
                )}
              </div>
            </nav>
          ) : null}
        </>
      )}
    </div>
  );
}

function RowContent({
  it,
  showKindBadge,
  missingLink,
}: {
  it: PublicStudyItem;
  showKindBadge: boolean;
  missingLink?: boolean;
}) {
  return (
    <>
      {showKindBadge ? (
        <span
          className="shrink-0 w-14 sm:w-16 text-[10px] font-semibold uppercase tracking-wide text-slate-400 pt-0.5"
          title={KIND_TAG[it.kind]}
        >
          {KIND_TAG[it.kind]}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-baseline sm:gap-3 gap-0.5">
        <span className="text-sm font-medium text-slate-900 leading-snug truncate group-hover:underline group-hover:underline-offset-2 decoration-slate-300">
          {it.title}
        </span>
        {it.description ? (
          <span
            className="text-xs text-slate-500 leading-tight sm:truncate sm:max-w-[min(60ch,100%)] line-clamp-2 sm:line-clamp-1"
            title={it.description}
          >
            {it.description}
          </span>
        ) : null}
      </span>
      {it.linkUrl ? (
        <span className="hidden sm:inline text-slate-300 shrink-0 text-xs" aria-hidden>
          ↗
        </span>
      ) : null}
      {missingLink ? (
        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
          Sem ligação
        </span>
      ) : null}
    </>
  );
}
