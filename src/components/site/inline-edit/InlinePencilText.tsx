"use client";

import Link from "next/link";
import { useId, useState, type MouseEvent } from "react";
import { PencilIcon } from "./PencilIcon";

type Props = {
  value: string;
  onChange: (next: string) => void;
  enabled?: boolean;
  multiline?: boolean;
  className?: string;
  inputClassName?: string;
  /** Título acessível para o botão de editar (curto) */
  editLabel: string;
  /** Se definido, o texto mostra-se como ligação estilizada quando não está a editar */
  asLink?: { href: string; className: string; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void };
  /** P.e. título num mapa: envolve tudo (texto + lápis) */
  block?: boolean;
  /**
   * Chamado ao sair do modo edição (blur no campo; Enter no input de linha única
   * faz blur). Recebe o valor final a partir do DOM (evita estado React desatualizado).
   */
  onEndEdit?: (finalValue: string) => void;
  /**
   * `compact` — ícone e botão pequenos, ao lado do texto (menu, legendas curtas;
   * evita o lápis `absolute` a cobrir o texto).
   */
  pencilVariant?: "default" | "compact";
};

/**
 * Texto de apresentação com ícone de lápis no canto superior; em edição, substitui o texto no sítio.
 */
export function InlinePencilText({
  value,
  onChange,
  enabled = false,
  multiline = false,
  className = "",
  inputClassName = "",
  editLabel,
  asLink,
  block = false,
  onEndEdit,
  pencilVariant = "default",
}: Props) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  const compact = pencilVariant === "compact";

  const base = compact
    ? block
      ? "inline-flex w-full min-w-0 max-w-full items-center gap-1 align-middle"
      : "inline-flex max-w-full items-center gap-1 align-middle"
    : block
      ? "relative block w-full"
      : "relative inline-block max-w-full";

  if (!enabled) {
    if (multiline) {
      return <span className={`whitespace-pre-line ${className}`.trim()}>{value}</span>;
    }
    if (asLink) {
      return (
        <Link href={asLink.href} className={asLink.className} onClick={asLink.onClick}>
          {value}
        </Link>
      );
    }
    return <span className={className}>{value}</span>;
  }

  /** Só estilos de controlo: `className` do site (gradiente, text-transparent, etc.) não vão para input/textarea — senão o texto fica invisível ou cortado. */
  const fieldClass = `rounded border border-blue-400/90 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1.5 w-full min-w-0 max-w-full box-border ${inputClassName}`;

  if (editing) {
    if (multiline) {
      return (
        <textarea
          id={id}
          className={fieldClass.trim()}
          rows={Math.min(12, 3 + (value?.split("\n").length ?? 0))}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => {
            onEndEdit?.(e.currentTarget.value);
            setEditing(false);
          }}
          autoFocus
          aria-label={editLabel}
        />
      );
    }
    return (
      <input
        id={id}
        className={fieldClass.trim()}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => {
          onEndEdit?.(e.currentTarget.value);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        autoFocus
        aria-label={editLabel}
      />
    );
  }

  const textPart = asLink ? (
    <Link href={asLink.href} className={asLink.className} onClick={asLink.onClick}>
      {value}
    </Link>
  ) : multiline ? (
    <span className={`whitespace-pre-line ${className}`.trim()}>{value}</span>
  ) : (
    <span className={className}>{value}</span>
  );

  const pencilButtonClass = compact
    ? "shrink-0 z-20 inline-flex h-4 w-4 items-center justify-center rounded border border-amber-400/70 bg-amber-50/95 text-amber-900 shadow-sm hover:bg-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-500 p-0"
    : "absolute -top-0.5 -right-0.5 z-20 inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md border border-amber-400/90 bg-amber-50 text-amber-900 shadow-sm hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500";
  const pencilIconClass = compact ? "h-2.5 w-2.5" : "h-3 w-3 sm:h-3.5 sm:w-3.5";

  return (
    <span className={`${base} group/inline ${compact ? "align-middle" : "align-top"}`.trim()}>
      {textPart}
      <button
        type="button"
        className={pencilButtonClass}
        onClick={(e) => {
          e.preventDefault();
          setEditing(true);
        }}
        aria-label={editLabel}
        title={editLabel}
      >
        <PencilIcon className={pencilIconClass} />
      </button>
    </span>
  );
}
