import { AxiosInstance, AxiosResponse } from 'axios'
import { Menu, UpdateMenu } from "../models/Menu";
import { RawMenu } from '../models/Order';

export class MenuService {
    private _apiService: AxiosInstance;

    constructor(apiService: AxiosInstance){
        this._apiService = apiService;
    }

    async fetchMenu(): Promise<RawMenu[]> {
        const response = await this._apiService.get<RawMenu[]>(`/menu?onlyAvailable=true`);
        return response.data;
    }

    async fetchMenuAll(): Promise<Menu[]> {
        const response = await this._apiService.get<Menu[]>(`/menu`);
        return response.data;
    }

    async addMenuItem(item: Menu): Promise<Menu> {
        const response = await this._apiService.post<Menu>(`/admin/menu`, item);
        return response.data;
    }

    async updateMenuItem(id: number, menu: UpdateMenu): Promise<Menu> {
        const response = await this._apiService.patch<Menu>(`/admin/menu/${id}`, menu);
        return response.data;
    }

    async deleteMenuItem(id: number) : Promise<AxiosResponse> {
        const response = await this._apiService.delete(`/admin/menu/${id}`);
        return response;
    }

    async uploadImage(formData: FormData) : Promise<AxiosResponse>{
        const response = await this._apiService.post("/admin/menu/image/upload", formData, { headers: {"Content-Type": "multipart/form-data"}});
        return response;
    }
}