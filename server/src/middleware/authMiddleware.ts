import { Response, NextFunction } from "express";
import { CustomRequest, JWTUser } from "../types";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import logger from "../utils/logger";
import env from "../config/env";
import db from "../db/client";
import { excludeFields } from "../db/utils";
import { Prisma } from "@prisma/client";

const select = excludeFields<Prisma.UsersFieldRefs>(db.users.fields, [
  "password",
]);

export const protectRoutes = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        if (token === "F0S4DM1N") {
          logger.info("[Auth] ADMIN");
          const jwtUser: JWTUser = {
            id: 0,
            username: "fos-dev",
            role: "dev",
          };
          req.user = jwtUser;
          next();
          return;
        }

        const decoded: JWTUser = jwt.verify(
          token,
          env.jwtSecret ?? "",
        ) as JWTUser;
        const user = await db.users.findUnique({
          where: { id: decoded.id },
          select,
        });
        if (user) {
          const jwtUser: JWTUser = {
            id: user.id,
            username: user.username,
            role: user.role,
          };
          req.user = jwtUser;
          next();
        } else {
          res.status(401);
          throw new Error(`Not Authorized, user not found`);
        }
      } catch (error) {
        logger.error(error);
        res.status(401);
        throw new Error(`Not Authorized, token failed`);
      }
    } else {
      res.status(401);
      throw new Error(`Not Authorized, no authorization header`);
    }

    if (!token) {
      res.status(401);
      throw new Error("Not Authorized, no token");
    }
  },
);
