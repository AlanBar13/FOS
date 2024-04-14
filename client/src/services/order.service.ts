import { RawOrder, UpdateOrder } from "../models/Order";
import { AxiosInstance, AxiosResponse } from "axios";

export class OrderService {
  private _apiService: AxiosInstance;

  constructor(apiService: AxiosInstance) {
    this._apiService = apiService;
  }

  async fetchOrders(): Promise<RawOrder[]> {
    return (await this._apiService.get("/admin/order")).data;
  }

  async fetchOrder(id: string): Promise<RawOrder> {
    return (await this._apiService.get<RawOrder>(`/admin/order/${id}`)).data;
  }

  async updateOrder(id: string, updatedOrder: UpdateOrder): Promise<RawOrder> {
    return (await this._apiService.patch(`/admin/order/${id}`, updatedOrder))
      .data;
  }

  async deleteItem(id: string, itemId: number): Promise<AxiosResponse> {
    return await this._apiService.delete(`/admin/order/${id}/items/${itemId}`);
  }
}
