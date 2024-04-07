import { Table } from "../models/Table";
import { AddItemToOrder, RawOrder, RawOrderItem } from "../models/Order";
import { AxiosInstance, AxiosResponse } from "axios";

export class TableService {
    private _apiService: AxiosInstance;

    constructor(apiService: AxiosInstance){
        this._apiService = apiService;
    }

    async fetchTables(): Promise<Table[]> {
        return (await this._apiService.get<Table[]>("/table")).data;
    }
    
    async createMultipleTables(amount: number, url: string): Promise<Table[]> {
        const response = await this._apiService.post<Table[]>(`/admin/table/multiple/${amount}`, {url});
        return response.data;
    }
    
    async deleteTables(): Promise<AxiosResponse> {
        return await this._apiService.delete(`/admin/table/destroy`);
    }
    
    async getActiveOrder(tableId: string): Promise<RawOrder> {
        return (await this._apiService.get<RawOrder>(`/table/${tableId}/order`)).data;
    }
    
    async createOrder(tableId: string): Promise<RawOrder> {
        return (await this._apiService.post(`/table/${tableId}/order`)).data;
    }
    
    async addOrderItem(tableId: string, order: number, item: AddItemToOrder): Promise<RawOrderItem> {
        return (await this._apiService.post(`/table/${tableId}/order/${order}/add`, item)).data;
    }
}