"use client";

import { useState, useTransition } from "react";
import { signInWithMasterAction } from "@/lib/auth/sign-in-master-action";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        start(async () => {
          const result = await signInWithMasterAction({ login, password, nextPath });
          if (result?.error) {
            setError(result.error);
          }
        });
      }}
    >
      <div>
        <label htmlFor="login-user" className="block text-sm font-medium text-slate-700 mb-1">
          Nome de utilizador
        </label>
        <input
          id="login-user"
          name="login"
          type="text"
          autoComplete="username"
          required
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 mb-1">
          Senha
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 text-white font-medium py-2.5 hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {pending ? "A entrar…" : "Entrar"}
      </button>
    </form>
  );
}
