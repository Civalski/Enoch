"use client";

import { useState } from "react";
import { logoutAction } from "@/lib/auth/logout-action";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await logoutAction();
    window.location.href = "/";
  }

  const base =
    "text-sm font-medium text-slate-700 border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50 disabled:opacity-60";
  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className={className ? `${base} ${className}` : base}
    >
      {loading ? "A sair…" : "Sair"}
    </button>
  );
}
