import IconInput from "../components/ui/IconInput";
import Logo from "../components/ui/Logo";
import Form from "../components/ui/Form";

import Footer from "../components/layout/Footer";

import { FiUser, FiLock } from "react-icons/fi";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

const Header = () => { 
    return (
    <header className="w-screen sticky top-0 h-20 py-5 px-15 flex items-center justify-between bg-secondary shadow-2xl z-50"> 
        <Logo /> 
    </header>
    );
};


const LoginPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();
    const [loginError, setLoginError] = useState(null)
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate("/dashboard")
        }
    }, [isAuthenticated, loading, navigate])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', {username: login, password})
            
            if (res.data.success && res.data.data.token){
                localStorage.setItem("jwtToken", res.data.data.token)
                navigate("/dashboard")
            }
            else {
                console.log("Erro no login")
            }
        } catch (error) {
            setLoginError(error.response?.data?.message)
        }

    };

    return (
        <>
            <Header />
            <main className="min-h-screen flex items-center justify-center text-dark">

                <div className="flex w-[900px] h-[500px] shadow-2xl bg-dark-accent overflow-hidden md:flex-row flex-col">
                    {/* Painel da marca */}
                    <div className="bg-dark w-full md:w-1/2 flex flex-col items-center justify-center p-10 text-center">
                        <Logo className="text-light text-4xl mb-6" />
                        <p className="text-white font-light tracking-widest text-sm md:text-base leading-relaxed">
                            Feita para os que amam e <br></br>
                            para os que vão amar
                        </p>
                    </div>

                    {/* Painel do formulário */}
                    <div className="w-full md:w-1/2 bg-[#EDE9E3] flex flex-col items-center justify-center p-10">
                        <Form title="Acessar conta" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm mb-1">Login</label>
                                <IconInput
                                    type="text"
                                    value={login}
                                    onChange={(e) => {setLogin(e.target.value)}}
                                    icon={<FiUser className="text-dark" />}
                                    required
                                    />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm mb-1">Senha</label>
                                <IconInput
                                    type="password"
                                    value={password}
                                    onChange={(e) => {setPassword(e.target.value)}}
                                    icon={<FiLock className="text-dark" />}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="login-button bg-primary text-dark py-3 font-medium mt-2 hover:bg-dark-accent hover:text-secondary transition w-full"
                                >
                                Entrar
                            </button>
                            
                        </Form>
                        {
                            loginError && 
                            <p className="text-center text-accent">{loginError}</p>
                        }
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default LoginPage;
