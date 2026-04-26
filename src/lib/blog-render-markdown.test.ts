import { describe, expect, it } from "vitest";
import { renderBlogMarkdownToHtml } from "./blog-markdown-html";

describe("renderBlogMarkdownToHtml", () => {
  it("renders GFM and strips script tags", async () => {
    const html = await renderBlogMarkdownToHtml(
      "# T\n\n[x](https://ex.com)\n\n<script>alert(1)</script>",
    );
    expect(html).toContain("<h1>");
    expect(html).toContain("T");
    expect(html).toContain('href="https://ex.com"');
    expect(html).not.toContain("<script>");
    // Markdown cru é escapado para texto; não executa como HTML
    expect(html).toContain("&lt;script&gt;");
  });

  it("allows tables from GFM", async () => {
    const md = "| a | b |\n|---|---|\n| 1 | 2 |";
    const html = await renderBlogMarkdownToHtml(md);
    expect(html).toContain("<table");
    expect(html).toContain("1");
  });
});
