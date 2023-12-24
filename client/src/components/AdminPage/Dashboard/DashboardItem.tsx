import { DashboardItems } from "../../../models/SocketModels";
import { socket, SocketEvents } from "../../../utils/socketClient";

import {Box} from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface DashboardItemProps {
    order: DashboardItems
    onPrepareClicked?: (order: DashboardItems) => void
    onReadyClicked?: (order: DashboardItems) => void
    ready?: boolean
}
export default function DashboardItem({ order, onPrepareClicked, onReadyClicked, ready }: DashboardItemProps){
    const orderPreparing = (order: DashboardItems) => {
        socket.emit(SocketEvents.clientUpdateOrder, order);
        onPrepareClicked!(order);
    }

    const orderReady = (order: DashboardItems) => {
        socket.emit(SocketEvents.clientOrderReady, order);
        onReadyClicked!(order);
    }

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} gutterBottom>
                    Mesa #{order.tableId} Pedido #{order.orderId}
                </Typography>
                <Typography variant="h5" component="div">
                    A preparar:
                </Typography>
                <Box>
                    {order.items.map((item) => (
                        <Typography key={item.id}>
                            {item.amount}x - {item.name}
                        </Typography>
                    ))}
                </Box>
            </CardContent>
            <CardActions>
                {ready ? (
                    <Button variant="contained" fullWidth color="warning" onClick={() => orderReady(order)}>Marcar como listo</Button>
                ) : (
                    <Button variant="contained" fullWidth color="success" onClick={() => orderPreparing(order)}>Preparar</Button>
                )}
                
            </CardActions>
        </Card>
    )
}