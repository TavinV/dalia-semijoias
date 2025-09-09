import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

import { ValidationError } from '../errors/errors.js';

class JwtServices {

    /**
     * Cria um token JWT
     * @param {Object} payload - Dados a serem incluídos no token
 * @returns {String} Token JWT
    */
    static createToken = (payload) => {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
    };

    /**
     * Verifica e decodifica um token JWT
     * @param {String} token - Token JWT
     * @returns {Object} Payload decodificado
     */
    static verifyToken = (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw new ValidationError('Token inválido ou expirado');
        }
    };

    /**
     * Extrai token do header Authorization
     * @param {String} authHeader - Header Authorization
     * @returns {String} Token JWT
     */
    static extractTokenFromHeader = (authHeader) => {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ValidationError('Formato de autorização inválido');
        }

        return authHeader.substring(7); // Remove 'Bearer ' do início
    };
}

export default JwtServices;