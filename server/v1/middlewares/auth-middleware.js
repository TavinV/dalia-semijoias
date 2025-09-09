import JwtServices from "../services/jwt-services.js";
import ApiResponse from "../utils/api-response.js";

import { ValidationError } from "../errors/errors.js";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    try {
        const token = JwtServices.extractTokenFromHeader(authHeader);
        const decoded = JwtServices.verifyToken(token);
        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof ValidationError) {
            return ApiResponse.UNAUTHORIZED(res, error.message);
        }
        return ApiResponse.ERROR(res, error.message);
    }
};
