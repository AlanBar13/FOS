import { AxiosResponse } from "axios";
import { User } from "../models/Users";
import { api } from "../utils/apiClient";

export const fetchUsers = async () : Promise<User[]> => {
    return (await api.get<User[]>("/admin/user")).data;
}

export const loginUser = async (username: string, password: string) : Promise<AxiosResponse> => {
    return await api.post("/login", {
        username: username,
        password: password
    });
}

export const createUser = async (username: string, password: string, role: string) : Promise<AxiosResponse> => {
    return await api.post("/admin/user", {
        username,
        password,
        role
    });
}
export const deleteUser = async (id: number) : Promise<AxiosResponse> => {
    return await api.delete(`/admin/user/${id}`);
}