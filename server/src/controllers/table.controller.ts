import {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import { Prisma } from '@prisma/client';
import db from "../db/client";
import { genQRCode } from "../utils/generateQRCode";

export const getTables = asyncHandler(async (req: Request, res: Response) => {
    const tables = await db.tables.findMany({ orderBy: { id: 'asc' }});
    res.json(tables);
})

export const registerTable = asyncHandler(async (req: Request, res: Response) => {
    const payload: Prisma.TablesCreateInput = req.body;

    const table = await db.tables.create({
        data: {...payload, updatedAt: new Date() }
    });

    res.json(table)
})

export const getTable = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const table = await db.tables.findUnique({where: { id }});
    res.json(table)
})

export const updateTable = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload: Prisma.TablesUpdateInput = req.body;

    const updatedTable = await db.tables.update({ where: { id }, data: payload });

    res.json(updatedTable)
})

export const deleteTable = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const deleted = await db.tables.delete({ where: { id }});

    if (deleted){
        res.json({"message": `Menu Item ${id} deleted successfully`})
    }else{
        throw new Error(`Could not delete Menu Item ${id}`)
    }
})

export const registerMultipleTables = asyncHandler(async (req: Request, res: Response) => {
    const amount = Number(req.params.amount);
    const { url } = req.body;

    let tables = [];
    for(let i = 1; i <= amount; i++){
        const tableInput: Prisma.TablesCreateInput = {
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const table = await db.tables.create({ data: tableInput });
        tables.push(table);
    }

    const updatedTables = await Promise.all(tables.map(async (table) => {
        return await db.tables.update({
            where: {
                id: table.id
            }, 
            data: {
                name: `Mesa ${table.id}`,
                qrcode: await genQRCode(`${url}?menu=${table.id}`)
            }
        })
    }))

    res.json(updatedTables);
})

export const deleteAllTables = asyncHandler(async (req: Request, res: Response) => {
    await db.tables.deleteMany({});
    await db.$queryRaw`TRUNCATE TABLE public."Tables" RESTART IDENTITY;`;

    res.json({"message": "All tables where destroyed and identity reset"});
})