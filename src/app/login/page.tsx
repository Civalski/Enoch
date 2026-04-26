import { redirect } from "next/navigation";

/** Rota legada; o painel de acesso encontra-se em `/admpainel`. */
export default function LoginPage() {
  redirect("/admpainel");
}
