import { api } from "../utils/apiClient";
import { GetOrder, Order } from '../models/Order';

export const fetchOrders = async () : Promise<Order[]> => {
    return (await api.get('/admin/order')).data;
}

export const fetchOrder = async (id: string) : Promise<GetOrder>  => {
    return (await api.get(`/admin/order/${id}`)).data;
}