import axios from "axios";

// Em build (Vercel) usa a API de produção; em dev usa localhost.
const baseURL = import.meta.env.PROD
    ? "https://dalia-semijoias-api.onrender.com/api/v1"
    : "http://localhost:3000/api/v1";

const api = axios.create({ baseURL });

export default api;
