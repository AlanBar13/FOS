import { Table } from "../db/models";
import { TableInput, TableOutput } from "../db/models/Table";
import { genQRCode } from "../utils/generateQRCode";

/**
* Create table on DB
*
* @param payload - Table attributes
* @returns Table from DB
*/
export const createTable = async (payload: TableInput): Promise<TableOutput> => {
    const newTable = await Table.create(payload);

    return newTable;
}

/**
* Get all tables from DB
*
* @param filters - filters for Query (disabled)
* @returns Array of Tables
*/
export const getAllTables = async (filters?: any): Promise<TableOutput[]> => {
    const tables = await Table.findAll({ attributes: { exclude: ["location", "updatedAt"]} });

    return tables;
}

/**
* Get table by table ID
*
* @param id - Table ID
* @returns Table from DB
*/
export const getTableById = async (id: number): Promise<TableOutput> => {
    const table = await Table.findByPk(id);

    if (!table) {
        throw new Error(`Not Found`)
    }

    return table;
}

/**
* Update table by table ID
*
* @param id - Table ID
* @param payload - Table Attributes
* @returns Table from DB
*/
export const updateTableById = async (id: number, payload: TableInput): Promise<TableOutput> => {
    const table = await Table.findByPk(id, { attributes: { exclude: ["location", "updatedAt"]}});

    if (!table) {
        throw new Error(`Table Not Found`)
    }

    const updatedTable = await table.update(payload);
    return updatedTable;
}

/**
* Delete table by table ID
*
* @param id - Table ID
* @returns True if it was deleted correctly
*/
export const deleteTableById = async (id: number): Promise<boolean> => {
    const deletedCount = await Table.destroy({ where: {id} });

    return !!deletedCount;
}

/**
* Create multiple tables by some amount
*
* @param amount - Amount of tables to create
* @returns List of tables created
*/
export const createMultipleTables = async (amount: number, url: string): Promise<TableOutput[]> => {
    const tablesArray: TableOutput[] = [];
    for(let i = 0; i < amount; i++){
        const table = await Table.create();
        const qrcode = await genQRCode(`${url}?mesa=${table.id}`);
        const updatedTable = await updateTableById(table.id, { name: `Mesa ${table.id}`, qrcode: qrcode ?? "" });
        tablesArray.push(updatedTable);
    }

    return tablesArray;
}

/**
* Delete All tables
*
* @returns True if it was deleted correctly
*/
export const destroyAllTables = async (): Promise<void> => {
    await Table.destroy({ truncate: true, restartIdentity: true })
}