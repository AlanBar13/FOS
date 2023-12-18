import jwt from 'jsonwebtoken';
import env from '../config/env';
import { JWTUser } from '../types'

const generateToken = (user: JWTUser) => {
    return jwt.sign(user, env.jwtSecret ?? "", {
        expiresIn: '7d'
    });
}

export default generateToken;