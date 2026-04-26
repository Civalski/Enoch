import type { AboutContentV1 } from "@/lib/institutional-site/types";

const inp =
  "mt-1 w-full border border-slate-300 rounded px-3 py-2 text-sm";
const lab = "block text-sm text-slate-700";

type Props = { about: AboutContentV1 };

export function InstitutionalAboutFields({ about }: Props) {
  const m = about.meta ?? {};
  const h = about.hero ?? {};
  const hi = about.historia ?? {};
  const mvv = about.mvv ?? {};
  const c = about.cta ?? {};
  const valoresText = (mvv.valoresLines ?? []).join("\n");

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        Textos da página pública &quot;Sobre&quot;. Um valor em cada linha na lista de valores; linhas
        vazias são ignoradas.
      </p>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Motor de busca</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className={lab}>
            Título da página
            <input name="about_meta_title" defaultValue={m.title ?? ""} className={inp} maxLength={200} />
          </label>
          <label className={lab}>
            Descrição curta
            <input name="about_meta_description" defaultValue={m.description ?? ""} className={inp} maxLength={500} />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Destaque no topo</h3>
        <label className={lab}>
          Título
          <input name="about_hero_title" defaultValue={h.title ?? ""} className={inp} maxLength={500} />
        </label>
        <label className={lab}>
          Subtítulo
          <textarea name="about_hero_subtitle" defaultValue={h.subtitle ?? ""} rows={2} className={inp} maxLength={12000} />
        </label>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">História</h3>
        <label className={lab}>
          Primeiro parágrafo
          <textarea name="about_hist_p1" defaultValue={hi.p1 ?? ""} rows={5} className={inp} maxLength={12000} />
        </label>
        <label className={lab}>
          Segundo parágrafo
          <textarea name="about_hist_p2" defaultValue={hi.p2 ?? ""} rows={5} className={inp} maxLength={12000} />
        </label>
        <label className={lab}>
          Imagem ao lado do texto (URL). Vazio = mesmo logótipo do cabeçalho.
          <input name="about_hist_imageUrl" defaultValue={hi.imageUrl ?? ""} className={inp} maxLength={2000} />
        </label>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Missão, visão e valores</h3>
        <label className={lab}>
          Missão
          <textarea name="about_mvv_missao" defaultValue={mvv.missao ?? ""} rows={4} className={inp} maxLength={12000} />
        </label>
        <label className={lab}>
          Visão
          <textarea name="about_mvv_visao" defaultValue={mvv.visao ?? ""} rows={4} className={inp} maxLength={12000} />
        </label>
        <label className={lab}>
          Título do bloco &quot;Valores&quot;
          <input name="about_mvv_valoresTitle" defaultValue={mvv.valoresTitle ?? ""} className={inp} maxLength={500} />
        </label>
        <label className={lab}>
          Lista de valores (um por linha)
          <textarea
            name="about_mvv_valoresLines"
            defaultValue={valoresText}
            rows={8}
            className={inp}
            maxLength={10000}
            spellCheck
          />
        </label>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Chamada no fim da página</h3>
        <label className={lab}>
          Título
          <input name="about_cta_title" defaultValue={c.title ?? ""} className={inp} maxLength={500} />
        </label>
        <label className={lab}>
          Parágrafo
          <textarea name="about_cta_p" defaultValue={c.p ?? ""} rows={3} className={inp} maxLength={12000} />
        </label>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className={lab}>
            Texto do botão principal
            <input name="about_cta_primaryLabel" defaultValue={c.primaryLabel ?? ""} className={inp} maxLength={500} />
          </label>
          <label className={lab}>
            Texto do botão secundário
            <input name="about_cta_secondaryLabel" defaultValue={c.secondaryLabel ?? ""} className={inp} maxLength={500} />
          </label>
        </div>
      </div>
    </div>
  );
}
