import Logo from "../components/ui/Logo";
import { NavLink } from "react-router-dom";

import { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import ProductsTable from "../components/modules/ProductsTable";

const Header = () => {
    return (
        <header className="w-screen sticky top-0 h-20 py-5 px-15 flex items-center justify-between bg-secondary shadow-2xl z-50">
            <Logo />
            <NavLink to="/create-product" className="bg-primary text-dark py-3 font-medium mt-2 hover:bg-dark-accent hover:text-secondary transition ease-in p-4 font-title text-white">Cadastrar Produto</NavLink>
        </header>
    );
};

const Dashboard = () => {
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
            <main className="p-5">
                <ProductsTable></ProductsTable>
            </main>
        </>
    );
};


export default Dashboard;