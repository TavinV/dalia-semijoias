import JwtServices from "../services/jwt-services.js";
import ApiResponse from "../utils/api-response.js";

const authController = {
    async login(req, res) {
        const { username, password } = req.body;

        if (username === process.env.ADMINLOGIN && password === process.env.ADMINPASSWORD) {
            const token = JwtServices.createToken({ username });
            return ApiResponse.OK(res, { token }, 'Login feito com sucesso');
        }

        return ApiResponse.UNAUTHORIZED(res, 'Login e(ou) senha incorreto(s)!');
    },
    async validateSession(req, res) {
        return ApiResponse.OK(res)
    }
};

export default authController;