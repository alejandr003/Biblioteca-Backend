import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const authRequired = (req, res, next) => {
    const { token } = req.cookies;
    
    if (!token) return res.status(401).json({ message: "No token, autorización denegada" });
    
    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token no válido" });
    }
};
