import Logo from "../components/ui/Logo";

import { NavLink } from "react-router-dom";

import { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import CreateProductForm from "../components/modules/CreateProductForm";

const Header = () => {
    return (
        <header className="w-screen sticky top-0 h-20 py-5 px-15 flex items-center justify-between bg-secondary shadow-2xl z-50">
            <Logo />
            <NavLink to="/dashboard" className="bg-primary text-dark py-3 font-medium mt-2 hover:bg-dark-accent hover:text-secondary transition ease-in p-4 font-title text-white">Estoque</NavLink>
        </header>
    );
};

const CreateProductPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && isAuthenticated === false) {
            navigate("/login");
        }
    }, [isAuthenticated, authLoading, navigate]);
    if (authLoading || isAuthenticated === null) return <p>Carregando...</p>;

    return (
        <>
            <Header />
            <main className="p-5 mt-12 flex justify-center items-center">
                <CreateProductForm></CreateProductForm>
            </main>
        </>
    );
};


export default CreateProductPage;