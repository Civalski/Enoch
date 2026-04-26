"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { saveHeaderBrandingObjectAction } from "@/app/app/institucional/actions";
import { InlinePencilText } from "@/components/site/inline-edit/InlinePencilText";
import { DEFAULT_LOGO_URL } from "@/lib/institutional-site/defaults";

type Props = {
  canEdit: boolean;
  orgName: string;
  headerTagline: string;
  logoUrl: string;
};

export function HeaderBrandBlock({ canEdit, orgName, headerTagline, logoUrl }: Props) {
  const router = useRouter();
  const [o, setO] = useState(orgName);
  const [h, setH] = useState(headerTagline);
  const [l, setL] = useState(logoUrl);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    setO(orgName);
    setH(headerTagline);
    setL(logoUrl);
  }, [orgName, headerTagline, logoUrl]);

  const save = useCallback(
    (patch: Partial<{ orgName: string; headerTagline: string; logoUrl: string }>) => {
      const next = {
        orgName: patch.orgName !== undefined ? patch.orgName : o,
        headerTagline: patch.headerTagline !== undefined ? patch.headerTagline : h,
        logoUrl: patch.logoUrl !== undefined ? patch.logoUrl : l,
      };
      if (patch.orgName !== undefined) setO(patch.orgName);
      if (patch.headerTagline !== undefined) setH(patch.headerTagline);
      if (patch.logoUrl !== undefined) setL(patch.logoUrl);
      setErr(null);
      startTransition(async () => {
        const r = await saveHeaderBrandingObjectAction({
          orgName: next.orgName,
          headerTagline: next.headerTagline,
          logoUrl: next.logoUrl,
        });
        if (!r.ok) {
          setErr(r.message);
        } else {
          router.refresh();
        }
      });
    },
    [router, o, h, l],
  );

  const imgSrc = l?.trim() || DEFAULT_LOGO_URL;

  if (!canEdit) {
    return (
      <Link href="/" className="flex items-center space-x-3 group min-w-0">
        <div className="h-12 w-auto flex shrink-0 items-center rounded-md bg-white p-0.5 group-hover:scale-105 transition-transform duration-300">
          <img src={imgSrc} alt={o} className="h-full w-auto object-contain bg-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {o}
          </span>
          {h ? <span className="text-xs text-gray-600 truncate">{h}</span> : null}
        </div>
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 min-w-0 max-w-[min(100%,24rem)]">
      {err ? (
        <p className="text-xs text-red-600" role="status">
          {err}
        </p>
      ) : null}
    <div className="flex items-start space-x-3 min-w-0">
      <Link href="/" className="h-12 w-auto flex shrink-0 items-center rounded-md bg-white p-0.5 hover:scale-105 transition-transform duration-300">
        <img
          src={imgSrc}
          alt={o}
          className={`h-full w-auto object-contain bg-white ${pending ? "opacity-70" : ""}`}
        />
      </Link>
      <div className="flex flex-col min-w-0 gap-0.5">
        <InlinePencilText
          enabled
          pencilVariant="compact"
          block
          value={o}
          onChange={(v) => setO(v)}
          onEndEdit={(final) => save({ orgName: final })}
          className="text-xl font-bold text-gray-900"
          inputClassName="text-xl font-bold"
          editLabel="Editar nome no cabeçalho"
        />
        <InlinePencilText
          enabled
          pencilVariant="compact"
          block
          value={h}
          onChange={(v) => setH(v)}
          onEndEdit={(final) => save({ headerTagline: final })}
          className="text-xs text-gray-600"
          inputClassName="text-xs"
          editLabel="Editar linha abaixo do nome"
        />
        <InlinePencilText
          enabled
          pencilVariant="compact"
          block
          value={l}
          onChange={(v) => setL(v)}
          onEndEdit={(final) => save({ logoUrl: final })}
          className="text-[10px] text-slate-500 font-mono truncate max-w-[11rem] sm:max-w-xs"
          inputClassName="text-xs font-mono"
          editLabel="URL do logótipo (cabeçalho, início, Sobre)"
        />
      </div>
    </div>
    </div>
  );
}
