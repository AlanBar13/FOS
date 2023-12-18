import {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import { TableInput } from "../db/models/Table";
import { getAllTables, getTableById, createTable, updateTableById, deleteTableById, createMultipleTables, destroyAllTables } from '../services/tables.service';
import cache from "../utils/cache";

export const getTables = asyncHandler(async (req: Request, res: Response) => {
    const tables = await getAllTables();
    cache.set(req.originalUrl, tables);
    res.json(tables);
})

export const registerTable = asyncHandler(async (req: Request, res: Response) => {
    const payload: TableInput = req.body;

    const table = await createTable(payload);

    res.json(table)
})

export const getTable = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const table = await getTableById(id);
    cache.set(req.originalUrl, table)
    res.json(table)
})

export const updateTable = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload: TableInput = req.body;

    const updatedTable = await updateTableById(id, payload);

    res.json(updatedTable)
})

export const deleteTable = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const deleted = await deleteTableById(id);

    if (deleted){
        res.json({"message": `Menu Item ${id} deleted successfully`})
    }else{
        throw new Error(`Could not delete Menu Item ${id}`)
    }
})

export const registerMultipleTables = asyncHandler(async (req: Request, res: Response) => {
    const amount = Number(req.params.amount);
    const { url } = req.body;

    const tables = await createMultipleTables(amount, url);

    res.json(tables);
})

export const deleteAllTables = asyncHandler(async (req: Request, res: Response) => {
    await destroyAllTables();

    res.json({"message": "All tables where destroyed and identity reset"});
})