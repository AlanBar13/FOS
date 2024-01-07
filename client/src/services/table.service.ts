import { api } from "../utils/apiClient";
import { Table } from "../models/Table";
import { AddItemToOrder, RawOrder, RawOrderItem } from "../models/Order";
import { AxiosResponse } from "axios";

export const fetchTables = async (): Promise<Table[]> => {
    return (await api.get("/table")).data;
}

export const createMultipleTables = async (amount: number, url: string): Promise<AxiosResponse> => {
    return await api.post(`/admin/table/multiple/${amount}`, {url});
}

export const deleteTables = async (): Promise<AxiosResponse> => {
    return await api.delete(`/admin/table/destroy`);
}

export async function getActiveOrder(tableId: string): Promise<RawOrder> {
    return (await api.get(`/table/${tableId}/order`)).data as RawOrder;
}

export const createOrder = async (tableId: string): Promise<RawOrder> => {
    return (await api.post(`/table/${tableId}/order`)).data;
}

export const addOrderItem = async (tableId: string, order: number, item: AddItemToOrder): Promise<RawOrderItem> => {
    return (await api.post(`/table/${tableId}/order/${order}/add`, item)).data as RawOrderItem;
}