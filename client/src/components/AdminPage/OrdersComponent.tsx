import { useState, useEffect } from 'react';
import { Order } from '../../models/Order';
import { fetchOrders } from '../../services/order.service';

import AdminAppBarComponent from './Shared/AdminAppBarComponent';
import OrdersDataComponent from './Orders/OrdersDataComponent';

export default function OrdersComponent(){
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const getData = async () => {
            try {
                const orders = await fetchOrders();

                setOrders(orders);
            }catch(error){
                console.log(error);
            }
        }

        getData();
    }, []);

    const replaceList = (newList: Order[]) => {
        setOrders(newList);
    }

    return(
        <>
            <AdminAppBarComponent title='Administracion Ordenes' />
            <OrdersDataComponent orders={orders} onTableChange={replaceList} />
        </>
    )
}