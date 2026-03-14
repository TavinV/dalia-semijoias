// AdminHeader.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage,
  FiPlusCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import Logo from "../ui/Logo";

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar scroll para efeito visual
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  const handleLogoutLink = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    handleLogout();
  };

  // Links de navegação
  const navLinks = [
    {
      to: "/dashboard",
      label: "Estoque",
      icon: FiPackage,
      exact: true,
    },
    {
      to: "/create-product",
      label: "Cadastrar Produto",
      icon: FiPlusCircle,
      exact: false,
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          w-full fixed top-0 z-50 
          transition-all duration-300
          ${
            scrolled
              ? "bg-white/95 backdrop-blur-md shadow-lg"
              : "bg-white shadow-md"
          }
        `}
      >
        {/* Linha decorativa superior */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#967965] via-[#B89A87] to-[#967965]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Logo />

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = link.exact
                  ? location.pathname === link.to
                  : location.pathname.startsWith(link.to);

                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => `
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      transition-all duration-300 group
                      ${
                        isActive
                          ? "bg-[#967965] text-white shadow-md"
                          : "text-gray-700 hover:bg-[#967965]/10 hover:text-[#967965]"
                      }
                    `}
                  >
                    <link.icon
                      size={18}
                      className={`
                        transition-colors duration-300
                        ${
                          location.pathname === link.to
                            ? "text-white"
                            : "text-gray-400 group-hover:text-[#967965]"
                        }
                      `}
                    />
                    <span className="text-sm font-medium">{link.label}</span>
                  </NavLink>
                );
              })}

              {/* Botão Sair */}
              <button
                onClick={handleLogout}
                className="
                  flex items-center gap-2 px-4 py-2 ml-2
                  text-gray-700 hover:text-red-600
                  transition-all duration-300 group
                  border-l border-gray-200
                "
              >
                <FiLogOut
                  size={18}
                  className="text-gray-400 group-hover:text-red-600 transition-colors"
                />
                <span className="text-sm font-medium">Sair</span>
              </button>
            </nav>

            {/* Botão Hamburguer Mobile */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiX size={24} className="text-gray-700" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiMenu size={24} className="text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Menu Mobile */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay escuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Painel do menu mobile */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-50 md:hidden"
            >
              {/* Cabeçalho do menu */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <span className="font-fancy text-lg text-gray-900">Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Links do menu */}
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = link.exact
                    ? location.pathname === link.to
                    : location.pathname.startsWith(link.to);

                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-all duration-300
                        ${
                          isActive
                            ? "bg-[#967965] text-white"
                            : "text-gray-700 hover:bg-[#967965]/10 hover:text-[#967965]"
                        }
                      `}
                    >
                      <link.icon size={18} />
                      <span className="text-sm font-medium">{link.label}</span>
                    </NavLink>
                  );
                })}

                {/* Separador */}
                <div className="my-4 border-t border-gray-100" />

                {/* Opções adicionais no mobile */}
                <button
                  onClick={handleLogoutLink}
                  className="
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    text-gray-700 hover:bg-red-50 hover:text-red-600
                    transition-all duration-300 group
                  "
                >
                  <FiLogOut size={18} className="group-hover:text-red-600" />
                  <span className="text-sm font-medium">Sair</span>
                </button>

                {/* Informações do admin */}
                <div className="mt-8 px-4 py-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#967965]/20 flex items-center justify-center">
                      <FiUser className="text-[#967965]" size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        Administrador
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        Dália Concept
                      </span>
                    </div>
                  </div>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Espaçador para compensar o header fixo */}
      <div className="h-16 sm:h-20" />
    </>
  );
};

export default AdminHeader;
