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

    const handleLogoutLink = (e) => {
        e.preventDefault();
        setMenuOpen(false);
        handleLogout();
    };

    return (
        <header className="w-full sticky top-0 z-50 bg-secondary shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
                <Logo />

                {/* Menu Desktop */}
                <nav className="hidden md:flex items-center space-x-6">
                    <NavLink
                        to="/dashboard"
                        className="text-black hover:text-primary transition"
                    >
                        Estoque
                    </NavLink>
                    <NavLink
                        to="/create-product"
                        className="bg-primary text-black py-2 px-4 rounded hover:bg-dark-accent hover:text-secondary transition"
                    >
                        Cadastrar Produto
                    </NavLink>
                    <NavLink
                        to="/login"
                        onClick={handleLogoutLink}
                        className="text-black hover:text-red-500 transition"
                    >
                        Sair
                    </NavLink>
                </nav>

                {/* Botão Hamburguer Mobile */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-black focus:outline-none"
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

            {/* Menu Mobile */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-2">
                    <NavLink
                        to="/dashboard"
                        className="block text-black hover:text-primary transition"
                        onClick={() => setMenuOpen(false)}
                    >
                        Estoque
                    </NavLink>
                    <NavLink
                        to="/create-product"
                        className="block text-black hover:text-primary transition"
                        onClick={() => setMenuOpen(false)}
                    >
                        Cadastrar Produto
                    </NavLink>
                    <NavLink
                        to="/login"
                        onClick={handleLogoutLink}
                        className="block text-black hover:text-red-500 transition"
                    >
                        Sair
                    </NavLink>
                </div>
            )}
        </header>
    );
};

export default AdminHeader;
