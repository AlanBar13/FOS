import { api } from "../utils/apiClient";
import { Table } from "../models/Table";
import { Order } from "../models/Order";
import { AxiosResponse } from "axios";
import { OrderItem } from "../models/OrderItem";

export const fetchTables = async (): Promise<Table[]> => {
    return (await api.get("/table")).data;
}

export const createMultipleTables = async (amount: number, url: string): Promise<AxiosResponse> => {
    return await api.post(`/admin/table/multiple/${amount}`, {url});
}

export const deleteTables = async (): Promise<AxiosResponse> => {
    return await api.delete(`/admin/table/destroy`);
}

export const getActiveOrder = async (tableId: string): Promise<AxiosResponse> => {
    return await api.get(`/table/${tableId}/order`);
}

export const createOrder = async (tableId: string): Promise<Order> => {
    return (await api.post(`/table/${tableId}/order`)).data;
}

export const addOrderItem = async (tableId: string, order: number, item: OrderItem): Promise<AxiosResponse> => {
    return await api.post(`/table/${tableId}/order/${order}/add`, item);
}