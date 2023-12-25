import { useParams } from 'react-router-dom';
import { Adapter } from '../../../utils/adapter';
import { OrderAdapter, Order } from '../../../models/OrderAdapter';
import AdminAppBarComponent from '../Shared/AdminAppBarComponent';
import OrderPreviewFormComponent from './OrderPreviewFormComponent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import "./OrderPreviewComponent.css"
import { useApi } from '../../../hooks/useApi';
import OrderItemTableComponent from './OrderItemTableComponent';


export default function OrderPreviewComponent() {
    const { id } = useParams();
    const { data, isLoading, error } = useApi<Order>({ 
        route: `/admin/order/${id}`, 
        method: "GET", 
        adapterFn: (data) => Adapter.from(data).to((item) => new OrderAdapter(item).adapt())
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
                                <Typography variant='h6'>Status: {data.formatedStatus}</Typography>
                            </div>
                            <Divider orientation='vertical' flexItem />
                            <div className='order-preview_data'>
                                <Typography variant='h6'>Subtotal: {data.subTotal}</Typography>
                                <Typography variant='h6'>IVA: {data.taxTotal}</Typography>
                            </div>
                            <Divider orientation='vertical' flexItem />
                            <div className='order-preview_data'>
                                <Typography variant='h6'>Total: {data.total}</Typography>
                                <Typography variant='h6'>Propina: {data.tips}</Typography>
                            </div>
                            <Divider orientation='vertical' flexItem />
                            <div className='order-preview_data'>
                                <Typography variant='h6'>Creado en: {data.createdAt}</Typography>
                                <Typography variant='h6'>Actualizado en: {data.updatedAt}</Typography>
                            </div>
                        </Paper>
                        <Divider sx={{ margin: '1rem' }} flexItem />
                        <OrderPreviewFormComponent orderStatus={data.status} />
                        <Divider sx={{ margin: '1rem' }} flexItem />
                        <OrderItemTableComponent items={data.items} />
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