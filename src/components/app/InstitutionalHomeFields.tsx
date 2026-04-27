import type { HomeContentV1 } from "@/lib/institutional-site/types";

const inp =
  "mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm";
const lab = "block text-sm text-slate-700";

type Props = { home: HomeContentV1 };

export function InstitutionalHomeFields({ home }: Props) {
  const h = home.hero ?? {};
  const q = home.quemSomos ?? {};
  const p = home.projetosTeaser ?? {};
  const s = home.stats?.items ?? [];
  const a = home.comoAjudar ?? {};
  const l = home.localizacao ?? {};
  const m = home.meta ?? {};

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Estes textos aparecem na página pública de início. Deixe os campos como estão (ou alinhe
        com os textos de exemplo) e altere só o que precisar.
      </p>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Motor de busca (título e descrição)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className={lab}>
            Título da página (tab do navegador)
            <input name="home_meta_title" defaultValue={m.title ?? ""} className={inp} maxLength={200} />
          </label>
          <label className={lab}>
            Descrição curta
            <input name="home_meta_description" defaultValue={m.description ?? ""} className={inp} maxLength={500} />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Destaque no topo (hero)</h3>
        <label className={lab}>
          Título principal
          <input name="home_hero_title" defaultValue={h.title ?? ""} className={inp} maxLength={500} />
        </label>
        <label className={lab}>
          Subtítulo
          <textarea name="home_hero_subtitle" defaultValue={h.subtitle ?? ""} rows={3} className={inp} maxLength={12000} />
        </label>
        <label className={lab}>
          Imagem de fundo do destaque (URL; opcional — vazio = predefinida)
          <input
            name="home_hero_imageUrl"
            defaultValue={h.imageUrl ?? ""}
            className={inp}
            maxLength={2000}
            placeholder="https://…"
          />
        </label>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Secção &quot;Quem somos&quot; (início)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className={lab}>
            Título da secção
            <input name="home_quem_sectionTitle" defaultValue={q.sectionTitle ?? ""} className={inp} maxLength={500} />
          </label>
          <label className={lab}>
            Subtítulo da secção
            <input name="home_quem_sectionSubtitle" defaultValue={q.sectionSubtitle ?? ""} className={inp} maxLength={12000} />
          </label>
        </div>
        <label className={lab}>
          Título do bloco da missão
          <input name="home_quem_missionHeading" defaultValue={q.missionHeading ?? ""} className={inp} maxLength={500} />
        </label>
        <label className={lab}>
          Imagem ao lado do texto (URL; vazio = logótipo do cabeçalhor)
          <input
            name="home_quem_missionImageUrl"
            defaultValue={q.missionImageUrl ?? ""}
            className={inp}
            maxLength={2000}
            placeholder="https://…"
          />
        </label>
        <label className={lab}>
          Primeiro parágrafo
          <textarea name="home_quem_p1" defaultValue={q.p1 ?? ""} rows={4} className={inp} maxLength={12000} />
        </label>
        <label className={lab}>
          Segundo parágrafo
          <textarea name="home_quem_p2" defaultValue={q.p2 ?? ""} rows={4} className={inp} maxLength={12000} />
        </label>
        <label className={lab}>
          Texto do botão (ex.: conhecer mais)
          <input name="home_quem_ctaLabel" defaultValue={q.ctaLabel ?? ""} className={inp} maxLength={500} />
        </label>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Projetos em destaque (três cartões)</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <label className={lab}>
            Título da secção
            <input name="home_proj_title" defaultValue={p.title ?? ""} className={inp} maxLength={500} />
          </label>
          <label className={lab}>
            Subtítulo
            <input name="home_proj_subtitle" defaultValue={p.subtitle ?? ""} className={inp} maxLength={12000} />
          </label>
          <label className={lab}>
            Texto do botão
            <input name="home_proj_ctaLabel" defaultValue={p.ctaLabel ?? ""} className={inp} maxLength={500} />
          </label>
        </div>
        {[0, 1, 2].map((i) => {
          const c = p.cards?.[i];
          return (
            <div
              key={i}
              className="rounded-md border border-slate-200 bg-slate-50/80 p-4 space-y-3"
            >
              <p className="text-sm font-medium text-slate-800">Cartão {i + 1}</p>
              <label className={lab}>
                Título
                <input name={`home_proj_card${i}_title`} defaultValue={c?.title ?? ""} className={inp} maxLength={500} />
              </label>
              <label className={lab}>
                Descrição
                <textarea
                  name={`home_proj_card${i}_description`}
                  defaultValue={c?.description ?? ""}
                  rows={3}
                  className={inp}
                  maxLength={12000}
                />
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <label className={lab}>
                  Imagem (endereço do ficheiro)
                  <input name={`home_proj_card${i}_image`} defaultValue={c?.image ?? ""} className={inp} maxLength={2000} />
                </label>
                <label className={lab}>
                  Link do botão
                  <input name={`home_proj_card${i}_link`} defaultValue={c?.link ?? ""} className={inp} maxLength={2000} />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Números (estatísticas)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => {
            const st = s[i];
            return (
              <div key={i} className="rounded-md border border-slate-200 p-3 space-y-2">
                <p className="text-xs font-medium text-slate-600">Estatística {i + 1}</p>
                <label className={lab}>
                  Número ou destaque
                  <input name={`home_stat${i}_n`} defaultValue={st?.n ?? ""} className={inp} maxLength={40} />
                </label>
                <label className={lab}>
                  Legenda
                  <input name={`home_stat${i}_label`} defaultValue={st?.label ?? ""} className={inp} maxLength={500} />
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Como ajudar (três colunas)</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <label className={lab}>
            Título
            <input name="home_ajuda_title" defaultValue={a.title ?? ""} className={inp} maxLength={500} />
          </label>
          <label className={lab}>
            Subtítulo
            <input name="home_ajuda_subtitle" defaultValue={a.subtitle ?? ""} className={inp} maxLength={12000} />
          </label>
          <label className={lab}>
            Texto do botão
            <input name="home_ajuda_ctaLabel" defaultValue={a.ctaLabel ?? ""} className={inp} maxLength={500} />
          </label>
        </div>
        {[0, 1, 2].map((i) => {
          const col = a.cols?.[i];
          return (
            <div key={i} className="rounded-md border border-slate-200 p-3 space-y-2">
              <p className="text-xs font-medium text-slate-600">Coluna {i + 1}</p>
              <label className={lab}>
                Título
                <input name={`home_ajuda_col${i}_title`} defaultValue={col?.title ?? ""} className={inp} maxLength={500} />
              </label>
              <label className={lab}>
                Texto
                <textarea name={`home_ajuda_col${i}_body`} defaultValue={col?.body ?? ""} rows={3} className={inp} maxLength={12000} />
              </label>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Localização (título abaixo do mapa)</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className={lab}>
            Título
            <input name="home_loc_title" defaultValue={l.title ?? ""} className={inp} maxLength={500} />
          </label>
          <label className={lab}>
            Subtítulo
            <input name="home_loc_subtitle" defaultValue={l.subtitle ?? ""} className={inp} maxLength={12000} />
          </label>
        </div>
      </div>
    </div>
  );
}
