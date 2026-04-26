"use client";

import { useActionState, useEffect, useRef } from "react";
import { initialContactFormState } from "@/app/contato/contact-form-state";
import { submitContactMessageAction } from "@/app/contato/actions";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactMessageAction,
    initialContactFormState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <div>
      {state.message ? (
        <p
          role="status"
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            state.ok
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {state.message}
        </p>
      ) : null}
      <form ref={formRef} className="space-y-6" action={formAction}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:shadow-lg"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:shadow-lg"
              placeholder="seu@email.com"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              id="telefone"
              name="telefone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:shadow-lg"
              placeholder="(00) 00000-0000"
            />
          </div>
          <div>
            <label htmlFor="assunto" className="block text-sm font-medium text-gray-700 mb-2">
              Assunto *
            </label>
            <select
              id="assunto"
              name="assunto"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:shadow-lg"
              defaultValue=""
            >
              <option value="">Selecione um assunto</option>
              <option value="doacao">Doação</option>
              <option value="voluntariado">Voluntariado</option>
              <option value="projetos">Projetos</option>
              <option value="parceria">Parceria</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem *
          </label>
          <textarea
            id="mensagem"
            name="mensagem"
            rows={6}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-400 focus:shadow-lg resize-none"
            placeholder="Escreva sua mensagem aqui..."
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span>
                <span className="inline-block spinner mr-2" />
                Enviando...
              </span>
            ) : (
              "Enviar Mensagem"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
