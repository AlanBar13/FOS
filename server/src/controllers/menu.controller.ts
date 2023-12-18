import {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import { MenuInput } from "../db/models/Menu";
import { getAllMenuItems, createMenuItem, updateMenuItem, getMenuItemById, deleteMenuItemById } from '../services/menu.service';
import logger from "../utils/logger";
import cache from "../utils/cache";

export const getMenuItems = asyncHandler(async (req: Request, res: Response) => {
    const { onlyAvailable } = req.query;
    const boolAvailable = Boolean(onlyAvailable);
    const menu = await getAllMenuItems({ available: boolAvailable });
    // Save in cache only list of available
    if (boolAvailable){
        cache.set(req.originalUrl, menu, 120);
    }
    
    res.json(menu);
})

export const registerMenuItem = asyncHandler(async (req: Request, res: Response) => {
    const payload: MenuInput = req.body;

    const menuItem = await createMenuItem(payload);

    res.json(menuItem)
})

export const getItem = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const menuItem = await getMenuItemById(id);

    res.json(menuItem)
})

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload: MenuInput = req.body;

    const menuItem = await updateMenuItem(id, payload);

    res.json(menuItem)
})

export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const deleted = await deleteMenuItemById(id);

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