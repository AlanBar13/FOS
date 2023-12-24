import { Outlet } from 'react-router-dom'
import {Box} from '@mui/material';
import AdminDrawer from "../components/AdminPage/AdminDrawer";

const drawerWidth = 60;

export default function AdminPage(){
    return (
        <>
            <AdminDrawer drawerWidth={drawerWidth} />
            <Box sx={{ flexGrow: 1, marginLeft: '4.5rem', marginRight: '1rem' } }>
                <Outlet />
            </Box>
        </>
    )
}