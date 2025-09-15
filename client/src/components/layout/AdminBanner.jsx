import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";

const AdminHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/login");
    };

    return (
        <header className="w-full sticky top-0 z-50 bg-secondary shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
                <Logo />

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center space-x-6 font-title">
                    <NavLink
                        to="/"
                        className="text-white hover:text-primary transition"
                    >
                        Estoque
                    </NavLink>
                    <NavLink
                        to="/create-product"
                        className="bg-primary text-dark py-2 px-4 rounded hover:bg-dark-accent hover:text-secondary transition"
                    >
                        Cadastrar Produto
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="text-white hover:text-red-400 transition"
                    >
                        Sair
                    </button>
                </nav>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white focus:outline-none"
                    >
                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {menuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 font-title">
                    <NavLink
                        to="/"
                        className="block py-2 text-white hover:text-primary transition"
                        onClick={() => setMenuOpen(false)}
                    >
                        Estoque
                    </NavLink>
                    <NavLink
                        to="/create-product"
                        className="block py-2 text-white hover:text-primary transition"
                        onClick={() => setMenuOpen(false)}
                    >
                        Cadastrar Produto
                    </NavLink>
                    <button
                        onClick={() => {
                            setMenuOpen(false);
                            handleLogout();
                        }}
                        className="block py-2 text-white hover:text-red-400 transition"
                    >
                        Sair
                    </button>
                </div>
            )}
        </header>
    );
};

export default AdminHeader;
