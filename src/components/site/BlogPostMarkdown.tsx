import { renderBlogMarkdownToHtml } from "@/lib/blog-render-markdown";

type Props = {
  markdown: string;
};

/**
 * Markdown do blog no servidor (SEO) com pipeline mais leve que react-markdown/remark-gfm.
 */
export async function BlogPostMarkdown({ markdown }: Props) {
  const html = await renderBlogMarkdownToHtml(markdown);
  return (
    <div
      className="prose prose-lg prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-blue-600 prose-img:rounded-xl prose-img:shadow-md"
      // HTML já passou por sanitize-html (sem scripts/handlers)
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
