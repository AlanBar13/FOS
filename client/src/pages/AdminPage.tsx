import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import {Box} from '@mui/material';
import AdminDrawer from "../components/AdminPage/AdminDrawer";

const drawerWidth = 60;

export default function AdminPage(){
    const { user } = useUser();
    const navigate = useNavigate();

    // useEffect(() => {
    //     console.log(user)
    //     if(!user){
    //         navigate(`/login`, { replace: true });
    //     }
    // }, []);

    return (
        <>
            <AdminDrawer drawerWidth={drawerWidth} user={user} />
            <Box sx={{ flexGrow: 1, marginLeft: '4.5rem', marginRight: '1rem' } }>
                <Outlet />
            </Box>
        </>
    )
}