import { Response, NextFunction } from "express";
import { CustomRequest } from "../types";
import cache from "../utils/cache";
import logger from "../utils/logger";
import env from "../config/env";

export const verifyCache = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (cache.has(req.originalUrl)) {
      logger.info(`[Cache] Hit ${req.originalUrl}`);
      return res.json(cache.get(req.originalUrl));
    }
    if (env.mode == "dev") logger.info(`[Cache] Missed ${req.originalUrl}`);
    return next();
  } catch (error) {
    throw new Error("[Cache] Error retreving cache");
  }
};
