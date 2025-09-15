import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export function useAuth() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setLoading(false);
            setIsAuthenticated(false)
            return;
        }

        const validateToken = async () => {
            try {
                const res = await api.get("/auth/validate-session", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log(res)
                if (res.status === 200 && res.data.success) {
                    setIsAuthenticated(true);
                    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                } else {
                    localStorage.removeItem("jwtToken");
                    setIsAuthenticated(false);
                }
            } catch {
                localStorage.removeItem("jwtToken");
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [navigate]);

    return { isAuthenticated, loading };
}
