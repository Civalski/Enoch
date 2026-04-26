import { redirect } from "next/navigation";

/** Registo automático desativado; acesso é apenas pela conta de administrador. */
export default function CadastroPage() {
  redirect("/");
}
