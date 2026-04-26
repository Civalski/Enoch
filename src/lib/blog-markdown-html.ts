import { marked } from "marked";
import type { IFilterXSSOptions } from "xss";
import filterXSS from "xss";

marked.setOptions({ gfm: true, breaks: true });

/** Whitelist GFM + atributos mínimos; `xss` é mais leve que sanitize-html no bundle do Worker. */
const XSS_OPTIONS: IFilterXSSOptions = {
  whiteList: {
    a: ["target", "href", "title", "rel"],
    abbr: ["title"],
    address: [],
    article: [],
    aside: [],
    b: [],
    bdi: ["dir"],
    bdo: ["dir"],
    big: [],
    blockquote: ["cite"],
    br: [],
    caption: [],
    center: [],
    cite: [],
    code: ["class"],
    col: ["align", "valign", "span", "width"],
    colgroup: ["align", "valign", "span", "width"],
    dd: [],
    del: ["datetime"],
    div: [],
    dl: [],
    dt: [],
    em: [],
    figcaption: [],
    figure: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    hr: [],
    i: [],
    img: ["src", "alt", "title", "width", "height", "loading", "class"],
    ins: ["datetime"],
    kbd: [],
    li: [],
    mark: [],
    ol: [],
    p: [],
    pre: ["class"],
    s: [],
    section: [],
    small: [],
    span: [],
    strong: [],
    strike: [],
    sub: [],
    sup: [],
    table: ["width", "border", "align", "valign"],
    tbody: ["align", "valign"],
    td: ["width", "rowspan", "colspan", "align", "valign"],
    tfoot: ["align", "valign"],
    th: ["width", "rowspan", "colspan", "align", "valign"],
    thead: ["align", "valign"],
    tr: ["rowspan", "align", "valign"],
    u: [],
    ul: [],
  },
};

export async function renderBlogMarkdownToHtml(markdown: string): Promise<string> {
  const raw = await marked(markdown, { async: true });
  return filterXSS(raw, XSS_OPTIONS);
}
