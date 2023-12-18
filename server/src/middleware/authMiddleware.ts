import {Response, NextFunction} from "express";
import { CustomRequest, JWTUser } from '../types';
import jwt from 'jsonwebtoken';
import { User } from '../db/models';
import asyncHandler from "express-async-handler";
import logger from '../utils/logger';
import env from "../config/env";

export const protectRoutes = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded: JWTUser = (jwt.verify(token, env.jwtSecret ?? "")) as JWTUser;
            const user = await User.findByPk(decoded.id, { attributes: { include: ["id", "username", "role"]}});
            req.user = user as JWTUser;
            next();
        } catch (error) {
            logger.error(error);
            res.status(401);
            throw new Error(`Not Authorized, token failed`);
        }
    }else{
        res.status(401);
        throw new Error(`Not Authorized, no authorization header`);
    }

    if(!token){
        res.status(401);
        throw new Error("Not Authorized, no token");
    }
});