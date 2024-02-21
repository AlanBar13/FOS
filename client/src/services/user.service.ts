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