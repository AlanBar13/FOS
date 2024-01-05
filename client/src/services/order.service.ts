import { api } from "../utils/apiClient";
import { RawOrder, UpdateOrder } from '../models/Order';
import { AxiosResponse } from "axios";

export const fetchOrders = async () : Promise<RawOrder[]> => {
    return (await api.get('/admin/order')).data;
}

export const fetchOrder = async (id: string) : Promise<RawOrder>  => {
    return (await api.get<RawOrder>(`/admin/order/${id}`)).data;
}

export const updateOrder = async (id: string, updatedOrder: UpdateOrder): Promise<RawOrder> => {
    return (await api.patch(`/admin/order/${id}`, updatedOrder)).data as RawOrder;
}

export const deleteItem = async (id: string, itemId: number): Promise<AxiosResponse> => {
    return await api.delete(`/admin/order/${id}/items/${itemId}`);
}