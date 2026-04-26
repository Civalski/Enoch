import type { Metadata } from "next";
import { LoginForm } from "@/components/app/LoginForm";
import { safeNextPath } from "@/lib/auth/safe-next-path";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Aceda à área reservada da A.R.L.S Enoch",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const nextPath = safeNextPath(typeof next === "string" ? next : null);

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Entrar</h1>
      <p className="text-slate-600 text-sm mb-8">Acesso reservado à equipa e à conta de manutenção do site.</p>
      {error === "auth" && (
        <p className="text-red-600 text-sm mb-4" role="alert">
          Não foi possível iniciar sessão. Verifique o utilizador e a senha.
        </p>
      )}
      <LoginForm nextPath={nextPath} />
    </div>
  );
}
