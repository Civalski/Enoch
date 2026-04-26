export function TransparenciaCompromisso() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg border-2 border-blue-200 shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent mb-4 drop-shadow-sm text-gradient-glow">
              Transparência Total
            </h3>
            <p className="bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent mb-4 font-medium leading-relaxed">
              A A.R.L.S Enoch tem como um de seus valores fundamentais a transparência. Acreditamos que todos os
              doadores têm o direito de saber como seus recursos estão sendo utilizados.
            </p>
            <p className="bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent mb-4 font-medium">
              Por isso, mantemos esta página atualizada regularmente com:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              {[
                "Extratos mensais detalhados de receitas e despesas",
                "Informações sobre a destinação de cada recurso recebido",
                "Relatórios de impacto dos projetos financiados",
                "Demonstrações financeiras anuais",
              ].map((t) => (
                <li key={t} className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent font-medium">
                  {t}
                </li>
              ))}
            </ul>
            <p className="bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent font-medium">
              Se tiver alguma dúvida sobre nossos relatórios ou quiser mais informações, não hesite em entrar em
              contato conosco.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
