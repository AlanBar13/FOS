import { useParams } from 'react-router-dom';
import { GetOrder, Order, OrderItem, getOrderItemStatusString, getOrderStatusSring } from '../../../models/Order';
import { useApi } from '../../../hooks/useApi';
import OrderItemTableComponent from './OrderItemTableComponent';
import { Mapper } from '../../../models/Mapper';
import { formatPriceFixed } from '../../../utils/numbers';
import AdminAppBarComponent from '../Shared/AdminAppBarComponent';
import OrderPreviewFormComponent from './OrderPreviewFormComponent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import "./OrderPreviewComponent.css"


export default function OrderPreviewComponent() {
    const { id } = useParams();
    const { data, isLoading, error } = useApi<Order>({ 
        route: `/admin/order/${id}`, 
        method: "GET", 
        mapperFn: (data) => Mapper<Order>(data, (item) => {
            const obj = item as GetOrder;
            const newOrder: Order = {
                id: obj.order.id,
                tableId: obj.order.tableId,
                formatedStatus: getOrderStatusSring(obj.order.status),
                status: obj.order.status,
                subTotal: formatPriceFixed(obj.order.subtotal),
                taxTotal: formatPriceFixed(obj.order.taxTotal),
                total: formatPriceFixed(obj.order.total),
                tips: formatPriceFixed(obj.order.tips),
                items: obj.items.map(item => {
                    const obj: OrderItem = {
                        orderId: item.orderId,
                        id: item.id,
                        menuId: item.menuId,
                        qty: item.qty,
                        menuName: item.Menu.name,
                        menuPrice: formatPriceFixed(item.Menu.price),
                        menuTax: formatPriceFixed(item.Menu.tax),
                        total: formatPriceFixed((item.Menu.price + item.Menu.tax) * item.qty),
                        comments: item.comments,
                        status: getOrderItemStatusString(item.status)
                    };
    
                    return obj;
                }),
                createdAt: new Date(obj.order.createdAt).toLocaleString(),
                updatedAt: new Date(obj.order.createdAt).toLocaleString()
            };
            return newOrder;
        })
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