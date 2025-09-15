import Logo from "../components/ui/Logo";
import AdminHeader from "../components/layout/AdminHeader";

import { NavLink } from "react-router-dom";

import { useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import ProductsTable from "../components/modules/ProductsTable";

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
            <AdminHeader />
            <main className="p-5">
                <ProductsTable></ProductsTable>
            </main>
        </>
    );
};


export default Dashboard;
