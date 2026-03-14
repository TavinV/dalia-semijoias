// LoginPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiLock, FiLogIn, FiEye, FiEyeOff } from "react-icons/fi";

import IconInput from "../components/ui/IconInput";
import Logo from "../components/ui/Logo";
import Form from "../components/ui/Form";
import Footer from "../components/layout/Footer";

import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full fixed top-0 h-20 px-6 sm:px-10 flex items-center bg-white/80 backdrop-blur-md shadow-sm z-50"
    >
      <Logo />
    </motion.header>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [loginError, setLoginError] = useState(null);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const res = await api.post("/auth/login", { username: login, password });

      if (res.data.success && res.data.data.token) {
        localStorage.setItem("jwtToken", res.data.data.token);

        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      }
    } catch (error) {
      setLoginError(
        error.response?.data?.message ||
          "Erro ao fazer login. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-24 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Painel da marca - Lado esquerdo simplificado */}
            <div className="bg-[#2C2C2C] p-12 flex flex-col items-center justify-center text-center min-h-[300px] md:min-h-full">
              <Logo className="text-white text-3xl mb-6" />
              <p className="text-gray-300 font-light text-sm leading-relaxed max-w-[200px]">
                Área administrativa
              </p>
              <div className="w-12 h-px bg-gray-600 my-6" />
            </div>

            {/* Painel do formulário - Lado direito */}
            <div className="p-8 md:p-12 bg-white">
              <div className="max-w-sm mx-auto w-full">
                {/* Cabeçalho do formulário */}
                <div className="text-center mb-8">
                  <h2 className="font-fancy text-2xl text-gray-900 mb-1">
                    Acessar conta
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Digite suas credenciais para entrar
                  </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      Login
                    </label>
                    <IconInput
                      type="text"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      icon={<FiUser className="text-gray-400" size={18} />}
                      placeholder="Seu usuário"
                      required
                      className="w-full  transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">
                      Senha
                    </label>
                    <div className="relative">
                      <IconInput
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<FiLock className="text-gray-400" size={18} />}
                        placeholder="Sua senha"
                        required
                        className="w-full border border-gray-200 focus:border-gray-400 transition-colors pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <FiEyeOff size={18} />
                        ) : (
                          <FiEye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Botão de login */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full py-3.5 px-4 text-sm font-medium
                      flex items-center justify-center gap-2
                      transition-all duration-300 mt-6
                      ${
                        isSubmitting
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-[#2C2C2C] text-white hover:bg-[#3C3C3C]"
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                        <span>Entrando...</span>
                      </>
                    ) : (
                      <>
                        <FiLogIn size={16} />
                        <span>Entrar</span>
                      </>
                    )}
                  </button>

                  {/* Mensagem de erro */}
                  <AnimatePresence>
                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-red-50 border border-red-100 rounded p-3 mt-4"
                      >
                        <p className="text-xs text-red-600 text-center">
                          {loginError}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
