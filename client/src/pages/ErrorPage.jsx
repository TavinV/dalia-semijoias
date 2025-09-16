import { useSearchParams } from "react-router-dom";
import Header from "../components/layout/Header";

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get("message") || "Houve um erro ao carregar a página.";

  return (
    <>
      <Header />
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 text-center px-4">
        {/* Card de erro */}
        <div className="p-30 max-w-lg animate-fade-in flex flex-col items-center gap-6">
          {/* Logo */}
          <img src="/logo.png" alt="Logo" className="w-20 h-auto" />

          {/* Título */}
          <h1 className="text-2xl font-bold text-accent">Oops! Algo deu errado.</h1>

          {/* Mensagem dinâmica */}
          <p className="text-gray-600">{errorMessage}</p>

          {/* Botões de ação */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2  border-accent text-accent hover:bg-accent hover:text-white transition-all"
            >
              Voltar
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-accent text-white hover:brightness-110 transition-all"
            >
              Ir para Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
