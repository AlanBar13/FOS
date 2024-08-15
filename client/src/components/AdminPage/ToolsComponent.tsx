import {useState, useEffect, ChangeEvent} from 'react';
import { useApi } from "../../hooks/ApiProvider";
import AdminAppBarComponent from "./Shared/AdminAppBarComponent";

import { Box } from "@mui/material";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

export default function ToolsComponent(){
    const api = useApi();
    const [orderingState, setOrderingState] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchState = async () => {
            setLoading(true);
            const result = await api.order.fetchOrdersStatus();
            setOrderingState(result);
            setLoading(false);
        };
        fetchState();
    }, []);

    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        setOrderingState(event.target.checked);
        await api.order.toggleOrderStatus();
    };

    return (
        <>
            <AdminAppBarComponent title="Herramientas de Administrador" />
            {loading ? <CircularProgress /> : (
                <Box>
                    <Typography>Controlar ordenes</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography>Apagado</Typography>
                        <Switch checked={orderingState} onChange={handleChange} color='success' inputProps={{ 'aria-label': 'controlled' }} />
                        <Typography>Prendido</Typography>
                    </Stack>
                </Box>
            )}
        </>
    )
}