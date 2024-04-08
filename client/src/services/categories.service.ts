import { AxiosInstance, AxiosResponse } from "axios";
import { Category } from "../models/Category";

export class CategoryService {
    private _apiService: AxiosInstance;

    constructor(apiService: AxiosInstance){
        this._apiService = apiService;
    }

    async fetchCategories(): Promise<Category[]> {
        const response = await this._apiService.get<Category[]>(`/admin/categories`);
        return response.data;
    }

    async addCategory(item: Category): Promise<Category> {
        const response = await this._apiService.post<Category>(`/admin/categories`, item);
        return response.data;
    }

    async updateCategory(id: number, menu: Category): Promise<Category> {
        const response = await this._apiService.patch<Category>(`/admin/categories/${id}`, menu);
        return response.data;
    }

    async deleteCategory(id: number) : Promise<AxiosResponse> {
        const response = await this._apiService.delete(`/admin/categories/${id}`);
        return response;
    }
}