import { Request, Response, NextFunction} from "express";
import env from "../config/env";
import logger from "../utils/logger";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`);
    res.status(404);
    next(error);
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    if (env.mode !== "test") logger.error(err.message);
    res.status(statusCode);
    res.json({
        code: statusCode,
        message: err.message,
        stack: env.mode === "dev" ? err.stack : null
    })
}