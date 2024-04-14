import { Response, Request } from "express";
import asyncHandler from "express-async-handler";
import db from '../db/client';
import { Prisma } from '@prisma/client';

export const createNewCategory = asyncHandler(async (req: Request, res: Response) => {
    const payload: Prisma.CategoriesCreateInput = req.body;

    const category = await db.categories.create({
        data: {
            ...payload
        }
    });

    res.json(category);
});

export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await db.categories.findMany({orderBy: { id: "asc" }});

    res.json(categories);
});

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const category = await db.categories.findFirst({ where: { id }});

    res.json(category);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload: Prisma.CategoriesCreateInput = req.body;

    const category = await db.categories.update({
        where: { id },
        data: {
            ...payload
        }
    });

    res.json(category);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const deleted = await db.categories.delete({ where: { id }});

    if (deleted){
        res.json({"message": `Category ${id} deleted successfully`})
    }else{
        throw new Error(`Could not delete Category ${id}`)
    }
});