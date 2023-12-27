import {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import { Prisma } from '@prisma/client';
import logger from "../utils/logger";
import cache from "../utils/cache";
import db from '../db/client';

export const getMenuItems = asyncHandler(async (req: Request, res: Response) => {
    const { onlyAvailable } = req.query;
    const boolAvailable = Boolean(onlyAvailable);

    let allMenu;
    if (boolAvailable){
        allMenu = await db.menu.findMany({ where: { available: boolAvailable }});
    }else {
        allMenu = await db.menu.findMany();
    }

    cache.set(req.originalUrl, allMenu, 120);
    res.json(allMenu);
})

export const registerMenuItem = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;

    const menuItem = await db.menu.create({
        data: {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            available: payload.available,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    });

    res.json(menuItem)
})

export const getItem = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const menuItem = await db.menu.findFirst({ where: { id }});

    res.json(menuItem)
})

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload: Prisma.MenuCreateInput = req.body;

    const menuItem = await db.menu.update({ where: { id }, data : {...payload, updatedAt: new Date() }});

    res.json(menuItem)
})

export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const deleted = await db.menu.delete({ where: { id }});

    if (deleted){
        res.json({"message": `Menu Item ${id} deleted successfully`})
    }else{
        throw new Error(`Could not delete Menu Item ${id}`)
    }
})

export const uploadMenuImage = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file as Express.MulterS3.File;

    if (file){
        res.json({ message: "Image uploaded succesfully", url: file.location})
    }else{
        logger.warn('[Menu] Image cannot be uploaded')
        throw new Error("Image could not be uploaded")
    }
});