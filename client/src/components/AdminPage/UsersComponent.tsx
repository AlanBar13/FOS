import { useEffect, useState } from "react";
import { User } from "../../models/Users";
import { useAlert } from "../../hooks/useAlert";
import AdminAppBarComponent from "./Shared/AdminAppBarComponent";
import { fetchUsers } from "../../services/user.service";
import axios, { AxiosError } from "axios";

export default function UsersComponent(){
    const { showAlert } = useAlert();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const users = await fetchUsers();
                setUsers(users);
            } catch (error) {
                if (axios.isAxiosError(error)){
                    const err = error as AxiosError;
                    if (err.response?.status === 401) {
                        showAlert(`Usuario no Autenticado`, "error");
                    }
                }else{
                    showAlert(`Error con el servidor`, "error");
                }
            }
        }

        getData();
    }, [])

    return(
        <>
            <AdminAppBarComponent title="Administracion de usuarios" />
            {JSON.stringify(users)}
        </>
    )
}