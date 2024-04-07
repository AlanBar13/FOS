import { AxiosInstance, AxiosResponse } from "axios";
import { LoginData, User } from "../models/Users";

export class UserService {
    private _apiService: AxiosInstance;

    constructor(apiService: AxiosInstance){
        this._apiService = apiService;
    }

    async fetchUsers() : Promise<User[]> {
        return (await this._apiService.get<User[]>("/admin/user")).data;
    }
    
    async loginUser(username: string, password: string) : Promise<LoginData> {
        return (await this._apiService.post<LoginData>("/login", {
            username: username,
            password: password
        })).data;
    }
    
    async createUser(username: string, password: string, role: string) : Promise<User> {
        return (await this._apiService.post<User>("/admin/user", {
            username,
            password,
            role
        })).data;
    }

    async deleteUser(id: number) : Promise<AxiosResponse> {
        return await this._apiService.delete(`/admin/user/${id}`);
    }
}