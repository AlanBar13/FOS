import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Prisma, Users } from "@prisma/client";
import generateToken from "../utils/generateJWTToken";
import { CustomRequest } from "../types";
import { UserRoles } from "../constants";
import { excludeFields } from "../db/utils";
import db from "../db/client";

const select = excludeFields<Prisma.UsersFieldRefs>(db.users.fields, [
  "password",
]);

export const getUsers = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const authUser = req.user;
    if (!authUser) {
      res.status(401);
      throw new Error(`Not authorized, not authenticated`);
    }

    if (authUser.role === UserRoles.admin || authUser.role === UserRoles.dev) {
      const users = await db.users.findMany({ select });

      res.json(users);
    } else {
      res.status(401);
      throw new Error(`User lacks permission`);
    }
  },
);

export const registerUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const authUser = req.user;
    if (!authUser) {
      res.status(401);
      throw new Error(`Not authorized, not authenticated`);
    }

    //Only devs or admin can create new users
    if (authUser.role === UserRoles.admin || authUser.role === UserRoles.dev) {
      const payload: Users = req.body;
      const user = await db.users.signup(
        payload.username,
        payload.password,
        payload.role,
      );

      //TODO: Set User creation guidelines
      //TODO: send errors if username or password doesnt follow guidelines
      if (user) {
        res.json(user);
      } else {
        throw new Error(`Could not create the user`);
      }
    } else {
      res.status(401);
      throw new Error(`User lacks permission`);
    }
  },
);

export const getUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const authUser = req.user;
    if (!authUser) {
      res.status(401);
      throw new Error(`Not authorized, not authenticated`);
    }

    if (authUser.role === UserRoles.admin || authUser.role === UserRoles.dev) {
      const id = Number(req.params.id);

      const user = await db.users.findUnique({ where: { id }, select });

      res.json(user);
    } else {
      res.status(401);
      throw new Error(`User lacks permission`);
    }
  },
);

export const deleteUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const authUser = req.user;
    if (!authUser) {
      res.status(401);
      throw new Error(`Not authorized, not authenticated`);
    }

    if (authUser.role === UserRoles.admin || authUser.role === UserRoles.dev) {
      const id = Number(req.params.id);

      const deleted = await db.users.delete({ where: { id } });

      if (deleted) {
        res.json({ message: `User ${id} was deleted successfully` });
      } else {
        throw new Error(`Could not delete User ${id}`);
      }
    } else {
      res.status(401);
      throw new Error(`User lacks permission`);
    }
  },
);

export const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const userData = await db.users.checkUser(username, password);

  if (userData !== null) {
    res.json({
      token: generateToken(userData),
      role: userData.role,
    });
  } else {
    res.status(401);
    throw new Error("Wrong password or Incorrect username");
  }
});
