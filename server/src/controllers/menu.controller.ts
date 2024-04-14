import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Prisma } from "@prisma/client";
import logger from "../utils/logger";
import cache from "../utils/cache";
import db from "../db/client";

interface MenuInput extends Prisma.MenuCreateInput {
  categoryId: number;
}

export const getMenuItems = asyncHandler(
  async (req: Request, res: Response) => {
    const { onlyAvailable } = req.query;
    const boolAvailable = Boolean(onlyAvailable);

    let allMenu;
    if (boolAvailable) {
      allMenu = await db.menu.findMany({
        where: { available: boolAvailable },
        include: { Category: true },
      });
    } else {
      allMenu = await db.menu.findMany({ include: { Category: true } });
    }

    cache.set(req.originalUrl, allMenu, 60);
    res.json(allMenu);
  },
);

export const registerMenuItem = asyncHandler(
  async (req: Request, res: Response) => {
    const payload: MenuInput = req.body;

    const menuItem = await db.menu.create({
      data: {
        name: payload.name,
        description: payload.description,
        available: payload.available,
        price: payload.price,
        tax: payload.tax,
        img: payload.img,
        prepTime: payload.prepTime,
        Category: {
          connect: {
            id: payload.categoryId,
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        Category: true,
      },
    });

    res.json(menuItem);
  },
);

export const getItem = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const menuItem = await db.menu.findFirst({ where: { id } });

  res.json(menuItem);
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const payload: Prisma.MenuCreateInput = req.body;

  const menuItem = await db.menu.update({
    where: { id },
    data: { ...payload, updatedAt: new Date() },
    include: { Category: true },
  });

  res.json(menuItem);
});

export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const deleted = await db.menu.delete({ where: { id } });

  if (deleted) {
    res.json({ message: `Menu Item ${id} deleted successfully` });
  } else {
    throw new Error(`Could not delete Menu Item ${id}`);
  }
});

export const uploadMenuImage = asyncHandler(
  async (req: Request, res: Response) => {
    const file = req.file as Express.MulterS3.File;

    if (file) {
      res.json({ message: "Image uploaded succesfully", url: file.location });
    } else {
      logger.warn("[Menu] Image cannot be uploaded");
      throw new Error("Image could not be uploaded");
    }
  },
);
