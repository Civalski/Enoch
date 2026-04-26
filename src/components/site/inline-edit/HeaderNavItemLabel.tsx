"use client";

import { type MouseEvent } from "react";
import { InlinePencilText } from "./InlinePencilText";

type Props = {
  href: string;
  value: string;
  active: boolean;
  onChange: (v: string) => void;
  onEndEdit: (final: string) => void;
  editLabel: string;
  /** Largura total no menu móvel */
  block?: boolean;
  onLinkClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

/**
 * Rótulo de ligação do menu principal: lápis (padrão InlinePencilText) e texto in-place.
 */
export function HeaderNavItemLabel({
  href,
  value,
  active,
  onChange,
  onEndEdit,
  editLabel,
  block = false,
  onLinkClick,
}: Props) {
  return (
    <InlinePencilText
      enabled
      block={block}
      pencilVariant="compact"
      value={value}
      onChange={onChange}
      onEndEdit={onEndEdit}
      editLabel={editLabel}
      asLink={{
        href,
        onClick: onLinkClick,
        className: block
          ? `block w-full min-w-0 text-sm font-medium ${
              active ? "text-blue-600" : "text-gray-700"
            }`
          : `text-sm font-medium transition-all duration-300 relative group ${
              active ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
            }`,
      }}
    />
  );
}
