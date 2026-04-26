import type { ReactNode } from "react";

type Props = {
  title?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
  id?: string;
  children: ReactNode;
};

/** Títulos de secção: gradiente no próprio texto — não no h2, para `bg-clip-text` funcionar com conteúdo aninhado (p.ex. InlinePencilText). */
function wrapTitleGradient(title: ReactNode) {
  if (typeof title === "string" || typeof title === "number") {
    return <span className="text-gradient-heading">{title}</span>;
  }
  return title;
}

function wrapSubtitleGradient(subtitle: ReactNode) {
  if (typeof subtitle === "string" || typeof subtitle === "number") {
    return <span className="text-gradient-subtle">{subtitle}</span>;
  }
  return subtitle;
}

export function Section({ title, subtitle, className = "", id, children }: Props) {
  return (
    <section className={`py-16 ${className}`} id={id}>
      <div className="container mx-auto px-4">
        {title ? (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{wrapTitleGradient(title)}</h2>
            {subtitle ? (
              <p className="text-lg max-w-2xl mx-auto font-medium">{wrapSubtitleGradient(subtitle)}</p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
