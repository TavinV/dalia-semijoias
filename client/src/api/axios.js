import axios from "axios";

// Em build (Vercel) usa a API de produção; em dev usa localhost.
const baseURL = import.meta.env.PROD
    ? "https://dalia-semijoias.onrender.com/api/v1"
    : "http://localhost:3000/api/v1";

// Timeout alto: o servidor (plano grátis na Render) "dorme" após inatividade
// e pode levar ~50s pra acordar. Sem isso, a 1ª requisição falharia.
const api = axios.create({ baseURL, timeout: 90000 });

// Reenvio automático quando o servidor está "acordando" (cold start):
// sem resposta da rede, timeout, ou 502/503/504. Evita os erros na primeira
// batida após o servidor dormir (login, carregar produtos/clientes, etc).
// NÃO reenvia em 401/403 (esses são erros reais de login/sessão).
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;
        if (!config) return Promise.reject(error);

        const status = error.response?.status;
        const isColdStart =
            !error.response ||
            error.code === "ECONNABORTED" ||
            status === 502 ||
            status === 503 ||
            status === 504;

        config.__retryCount = config.__retryCount || 0;
        if (isColdStart && config.__retryCount < 5) {
            config.__retryCount += 1;
            await new Promise((resolve) => setTimeout(resolve, 3000));
            return api(config);
        }

        return Promise.reject(error);
    },
);

export default api;
