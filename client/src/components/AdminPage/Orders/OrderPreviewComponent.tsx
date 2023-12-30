import { useParams } from 'react-router-dom';
import { RawOrder, getOrderStatusSring } from '../../../models/Order';
import { useApi } from '../../../hooks/useApi';
import { formatPriceFixed } from '../../../utils/numbers';
import { formatStringDate } from '../../../utils/dates';
import OrderItemTableComponent from './OrderItemTableComponent';
import AdminAppBarComponent from '../Shared/AdminAppBarComponent';
import OrderPreviewFormComponent from './OrderPreviewFormComponent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import "./OrderPreviewComponent.css"


export default function OrderPreviewComponent() {
    const { id } = useParams();
    const { data, isLoading, error } = useApi<RawOrder>({ 
        route: `/admin/order/${id}`, 
        method: "GET"
    });

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
                        <OrderPreviewFormComponent orderStatus={data.status} />
                        <Divider sx={{ margin: '1rem' }} flexItem />
                        {data.OrderItems && data.OrderItems.length > 0 ? (
                            <OrderItemTableComponent items={data.OrderItems} />
                        ):(
                            <Typography>No hay productos</Typography>
                        )}
                    </div>
                ) : (
                    <div>
                        <Typography>
                            Orden No disponible
                        </Typography>
                        {error}
                    </div>
                )
            )} 
        </>
    )
}