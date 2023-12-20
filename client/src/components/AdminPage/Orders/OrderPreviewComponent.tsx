import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchOrder } from '../../../services/order.service';
import { GetOrder } from '../../../models/Order';
import { formatDate } from '../../../utils/dates';
import { formatPriceFixed } from '../../../utils/numbers';
import { OrderStatus } from '../../../utils/constants';
import AdminAppBarComponent from '../Shared/AdminAppBarComponent';
import OrderItemTableComponent from './OrderItemTableComponent';
import OrderPreviewFormComponent from './OrderPreviewFormComponent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import "./OrderPreviewComponent.css"


export default function OrderPreviewComponent() {
    const { id } = useParams();
    const [orderData, setOrderData] = useState<GetOrder | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            try {
                if (id == null){
                    //navigate to 404 page?
                    return;
                }
    
                const data = await fetchOrder(id)
                setOrderData(data);
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        }
        
        getData();
    }, []);

    return (
        <>
            <AdminAppBarComponent title={`Orden #${id}`} backUrl={'/admin/orders'} />
            {isLoading ? (
                <CircularProgress />
            ) : (
                <div>
                    <Paper sx={{display: 'flex', flexDirection: "row", justifyContent: 'space-around'}}>
                        <div className='order-preview_data'>
                            <Typography variant='h6'>Mesa # {orderData?.order.tableId}</Typography>
                            <Typography variant='h6'>Status: {OrderStatus.getSpanishName(orderData?.order.status)}</Typography>
                        </div>
                        <Divider orientation='vertical' flexItem />
                        <div className='order-preview_data'>
                            <Typography variant='h6'>Subtotal: {formatPriceFixed(orderData?.order.subtotal)}</Typography>
                            <Typography variant='h6'>IVA: {formatPriceFixed(orderData?.order.taxTotal)}</Typography>
                        </div>
                        <Divider orientation='vertical' flexItem />
                        <div className='order-preview_data'>
                            <Typography variant='h6'>Total: {formatPriceFixed(orderData?.order.total)}</Typography>
                            <Typography variant='h6'>Propina: {formatPriceFixed(orderData?.order.tips)}</Typography>
                        </div>
                        <Divider orientation='vertical' flexItem />
                        <div className='order-preview_data'>
                            <Typography variant='h6'>Creado en: {formatDate(orderData?.order.createdAt)}</Typography>
                            <Typography variant='h6'>Actualizado en: {formatDate(orderData?.order.updatedAt)}</Typography>
                        </div>
                    </Paper>
                    <Divider sx={{ margin: '1rem' }} flexItem />
                    <OrderPreviewFormComponent orderStatus={orderData?.order.status} />
                    <Divider sx={{ margin: '1rem' }} flexItem />
                    <OrderItemTableComponent items={orderData?.items} />
                </div>
            )} 
        </>
    )
}