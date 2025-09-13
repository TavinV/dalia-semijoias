import axios from "axios";

const api = axios.create({
    baseURL: "/api/v1", // o proxy no package.json já redireciona para http://localhost:3000
});

export default api;
