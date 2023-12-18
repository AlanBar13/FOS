import { api } from "../utils/apiClient";
import { Order } from '../models/Order';

export const fetchOrders = async () : Promise<Order[]> => {
    return (await api.get('/admin/order')).data;
}