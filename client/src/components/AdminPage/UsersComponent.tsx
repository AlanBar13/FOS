import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { User } from "../../models/Users";
import { useAlert } from "../../hooks/useAlert";
import { useApi } from "../../hooks/ApiProvider";

import AdminAppBarComponent from "./Shared/AdminAppBarComponent";
import UserTableComponent from "./Users/UserTableComponent";
import UserDialogComponent from "./Users/UserDialogComponent";

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import DialogComponent from "../Shared/DialogComponent";

export default function UsersComponent(){
    const { showAlert } = useAlert();
    const api = useApi();
    const [users, setUsers] = useState<User[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const users = await api.user.fetchUsers();
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
            setLoading(false);
        }

        getData();
    }, [])

    const closeModal = () => {
        setOpen(false);
    }

    const createNewUser = async (username: string, password: string, role: string) => {
        setLoading(true);
        const newUser = await api.user.createUser(username, password, role);
        setUsers([...users, newUser]);
        closeModal();
        setLoading(false);
    }

    const beforeDelete = (user: User) => {
        setUserToDelete(user);
        setOpenInfo(true);
    }

    const deleteUsr = async () => {
        setLoading(true);
        try {
            if(userToDelete){
                await api.user.deleteUser(userToDelete.id)
                const newUserList = users.filter((user) => user.id !== userToDelete.id);
                setUsers(newUserList);
            }else{
                showAlert("Usuario a borrar desonocido", "error");
            }
        } catch (error) {
            showAlert("Error borrando al usuario", "error")
        }
        setOpenInfo(false);
        setUserToDelete(null);
        setLoading(true);
    }

    return(
        <>
            <AdminAppBarComponent title="Administracion de usuarios" />
            <Button sx={{ marginBottom: '1rem' }} fullWidth variant='contained' color='info' onClick={() => setOpen(true)}>Crear nuevo usuario</Button>
            {loading ? (<CircularProgress />) : (<UserTableComponent users={users} deleteUser={beforeDelete} />)}
            <UserDialogComponent open={open} closeModal={closeModal} createUser={createNewUser} />
            <DialogComponent isOpen={openInfo} title="Borrar Usuario" enableActions onCancel={() => setOpenInfo(false)} onConfirm={deleteUsr}>
                <Typography>Estas seguro que quieres eliminar el usuario {userToDelete?.username}</Typography>
            </DialogComponent>
        </>
    )
}