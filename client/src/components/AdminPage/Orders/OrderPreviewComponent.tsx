import { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { RawOrder, UpdateOrder, getOrderStatusSring, RawMenu } from '../../../models/Order';
import { useAlert } from '../../../hooks/useAlert';
import { useApi } from '../../../hooks/ApiProvider';
import { formatPriceFixed } from '../../../utils/numbers';
import { formatStringDate } from '../../../utils/dates';
import { AddToDashboardItems } from '../../../models/SocketModels';
import { SocketEvents, socket } from '../../../utils/socketClient';

import OrderItemTableComponent from './OrderItemTableComponent';
import AdminAppBarComponent from '../Shared/AdminAppBarComponent';
import OrderPreviewFormComponent from './OrderPreviewFormComponent';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogActionsContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import "./OrderPreviewComponent.css"

export default function OrderPreviewComponent() {
    const { id } = useParams();
    const { showAlert } = useAlert();
    const api = useApi();
    const [isLoading, setisLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState("");
    const [data, setData] = useState<RawOrder | null>(null);
    const [menu, setMenu] = useState<RawMenu[]>([]);
    const [qty, setQty] = useState<number>(0);
    const [modalLoading, setModalLoading] = useState<boolean>(false);

    useEffect(() => {
        const getData = async () => {
            try {
                if (id == null){
                    return;
                }

                const order = await api.order.fetchOrder(id);
                setData(order);
            } catch (error) {
                showAlert(`Error: ${(error as Error).message}`, 'error');
            }
        }

        getData();
    }, [])

    const onUpdateOrder = async (updatedOrder: UpdateOrder) => {
        if (id == null){
            return;
        }

        setisLoading(true);
        try {
            const newOrder = await api.order.updateOrder(id, updatedOrder);
            if (data){
                setData({...data, status: newOrder.status, tips: newOrder.tips})
            }
        } catch (error) {
            showAlert(`Error: ${(error as Error).message}`, 'error');
        }
        setisLoading(false);
    }

    const deleteOrderItem = async (itemId: number) => {
        if (id == null){
            return;
        }

        try {
            await api.order.deleteItem(id, itemId)
            window.location.reload();
        } catch (error) {
            showAlert(`Error: ${(error as Error).message}`, 'error');
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = async () => {
        try {
            const menu = await api.menu.fetchMenu();
            setMenu(menu);
            setOpen(true);
        } catch (error) {
            console.log(error);
            showAlert(`Error con el servidor`, 'error');
        }
    }

    const handleChangeMenu = (event: SelectChangeEvent) => {
        const menuId = event.target.value;
        if (menuId === "0"){
            showAlert('Mesa seleccionada no disponible', 'warning');
            return;
        }

        setSelection(menuId);
    }

    const handleChangeQty = (event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.target.value === ""){
            setQty(0);
        }else{
            const qty = parseInt(event.target.value);
            if (qty > 0)
                setQty(qty);
            else
                showAlert("Cantidad tiene que ser mayor a 0", "warning");
        }
    }

    const createItem = async () => {
        try {
            if (data == null){
                return;
            }
            
            setModalLoading(true);
            const newOrderItem = await api.table.addOrderItem(`${data.tableId}`, data.id, {
                menuId: parseInt(selection),
                qty: qty
            });

            const newOrder = data;
            if (newOrder.OrderItems){
                newOrder.OrderItems = [...newOrder.OrderItems, newOrderItem];
                setData(newOrder);
            }

            const dashboardItem: AddToDashboardItems = {
                orderItemId: newOrderItem.id,
                id: newOrderItem.Menu.id,
                name: newOrderItem.Menu.name,
                price: newOrderItem.Menu.price,
                amount: newOrderItem.qty,
                status: newOrderItem.status,
                total: newOrderItem.qty * newOrderItem.Menu.price
            }

            socket.emit(SocketEvents.clientSendOrder, data.id, data.tableId, [dashboardItem]);
            setOpen(false);
            setModalLoading(false);
            window.location.reload();
        } catch (error) {
            showAlert(`Error al crear nuevo producto a la order ${data?.id}`, "error")
            setModalLoading(false);
        }
    }

    return (
        <>
            <AdminAppBarComponent title={`Orden #${id}`} backUrl={'/admin/orders'} />
            {isLoading ? (
                <CircularProgress />
            ) : (
                data ? (
                    <div>
                        <Paper sx={{display: 'flex', flexDirection: "row", justifyContent: 'space-around'}}>
                            <div className='order-preview_data'>
                                <Typography variant='h6'>Mesa # {data.tableId}</Typography>
                                <Typography variant='h6'>Status: {getOrderStatusSring(data.status)}</Typography>
                            </div>
                            <Divider orientation='vertical' flexItem />
                            <div className='order-preview_data'>
                                <Typography variant='h6'>Subtotal: {formatPriceFixed(data.subtotal)}</Typography>
                                <Typography variant='h6'>IVA: {formatPriceFixed(data.taxTotal)}</Typography>
                            </div>
                            <Divider orientation='vertical' flexItem />
                            <div className='order-preview_data'>
                                <Typography variant='h6'>Total: {formatPriceFixed(data.total)}</Typography>
                                <Typography variant='h6'>Propina: {formatPriceFixed(data.tips)}</Typography>
                            </div>
                            <Divider orientation='vertical' flexItem />
                            <div className='order-preview_data'>
                                <Typography variant='h6'>Creado en: {formatStringDate(data.createdAt)}</Typography>
                                <Typography variant='h6'>Actualizado en: {new Date(data.updatedAt).toLocaleString()}</Typography>
                            </div>
                        </Paper>
                        <Divider sx={{ margin: '1rem' }} flexItem />
                        <Button fullWidth variant='contained' color='info' onClick={handleOpen}>Agregar Producto a la Orden</Button>
                        <Divider sx={{ margin: '1rem' }} flexItem />
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <OrderPreviewFormComponent orderStatus={data.status} tips={data.tips} UpdateOrder={onUpdateOrder} />
                        )}
                        <Divider sx={{ margin: '1rem' }} flexItem />
                        {data.OrderItems && data.OrderItems.length > 0 ? (
                            <OrderItemTableComponent items={data.OrderItems} onDelete={deleteOrderItem} />
                        ):(
                            <Typography>No hay productos</Typography>
                        )}
                    </div>
                ) : (
                    <div>
                        <Typography>
                            Orden No disponible
                        </Typography>
                    </div>
                )
            )}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Agregar Producto</DialogTitle>
                {modalLoading ? (
                    <CircularProgress sx={{margin: '3rem'}} />
                ) : (
                    <DialogActionsContent>
                        <FormControl sx={{marginTop: '0.5rem'}} fullWidth>
                            <InputLabel>Producto:</InputLabel>
                            <Select label="Producto:" value={selection} onChange={handleChangeMenu}>
                                {menu.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl sx={{marginTop: '0.5rem'}} fullWidth>
                            <InputLabel>Cantidad</InputLabel>
                            <OutlinedInput label="Cantidad:" value={qty} onChange={handleChangeQty} />
                        </FormControl>
                    </DialogActionsContent>
                )}
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={createItem}>Agregar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}