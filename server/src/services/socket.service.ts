import {Socket} from 'socket.io';
import { io } from '../server';
import logger from '../utils/logger';
import { OrderInput } from "../db/models/Order";
import { getOrderById, updateOrderStatsuById, updateOrderById } from "../services/order.service";
import { ItemStatus, OrderStatus, PaymentMethods } from '../constants';
import { AddToDashboardItems, DashboardItems, NeedWaiterRequest } from '../types';
import { updateOrderItemStatusById } from './orderItems.service';

export const onlineClients = new Set();

export const onNewWebSocketConnection = (socket: Socket) => {
    logger.info(`Socket ${socket.id} has connected`);
    onlineClients.add(socket.id);

    socket.on("connect", () => {
        socket.emit('id', socket.id)
    });

    socket.on("disconnect", () => {
        onlineClients.delete(socket.id);
        logger.info(`Socket ${socket.id} has disconnected`)
    });

    // More socket logic
    socket.on("sendOrder", async (order_id: number, table_id: number, items: AddToDashboardItems[]) => {
        logger.info(`socket called args ${order_id}, ${table_id} ${JSON.stringify(items)}`)
        try {
            const currentOrder = await getOrderById(order_id);

            if (currentOrder.tableId !== table_id){
                throw new Error(`Order does not belong to Table`);
            }

            if (currentOrder.status === OrderStatus.deleted || currentOrder.status === OrderStatus.notPaid || currentOrder.status === OrderStatus.paid || currentOrder.status === OrderStatus.userClosed){
                throw new Error(`Order closed`);
            }


            if (currentOrder && items){
                const dashboardItem : DashboardItems = {
                    id: `${currentOrder.id}_${currentOrder.tableId}_${Date.now()}`,
                    orderId: currentOrder.id,
                    tableId: currentOrder.tableId,
                    orderStatus: OrderStatus.ordering,
                    items
                }
                io.emit("dashboardOrderServer", dashboardItem);
            }else{
                throw new Error(`Order could not be updated`)
            }
        } catch (error) {
            logger.error(`[Socket] ${error}`);
        }
    });

    socket.on("orderUpdate", async (dashboardItem: DashboardItems) => {
        console.log("orderUpdate", dashboardItem)
        try {
            if (!dashboardItem.items || dashboardItem.items.length === 0){
                throw new Error(`No items sent`);
            }

            const order = await getOrderById(dashboardItem.orderId);
            if (order.tableId !== dashboardItem.tableId){
                throw new Error(`Order does not belong to Table`);
            }

            const udpatedOrder = await updateOrderStatsuById(dashboardItem.orderId, OrderStatus.inKitchen);
            if (udpatedOrder){
                await Promise.all(
                    dashboardItem.items.map(async (item) => {
                        await updateOrderItemStatusById(item.orderItemId, ItemStatus.inProgress);
                    })
                )
                dashboardItem.orderStatus = OrderStatus.inKitchen;
                const updatedItems = dashboardItem.items.map((item) => ({...item, status: ItemStatus.inProgress}));
                dashboardItem.items = updatedItems;
                io.emit("orderUpdateServer", dashboardItem);
            }
        } catch (error) {
            logger.error(`[Socket] ${error}`);
        }
    });

    socket.on("orderReady", async (dashboardItem: DashboardItems) => {
        console.log("orderReady", dashboardItem)
        try {
            if (!dashboardItem.items || dashboardItem.items.length === 0){
                throw new Error(`No items sent`);
            }

            const udpatedOrder = await updateOrderStatsuById(dashboardItem.orderId, OrderStatus.served);
            if (udpatedOrder){
                await Promise.all(
                    dashboardItem.items.map(async (item) => {
                        await updateOrderItemStatusById(item.orderItemId, ItemStatus.done);
                    })
                )
                dashboardItem.orderStatus = OrderStatus.served;
                const updatedItems = dashboardItem.items.map((item) => ({...item, status: ItemStatus.done}));
                dashboardItem.items = updatedItems;
                io.emit("orderReadyServer", dashboardItem);
            }
        } catch (error) {
            logger.error(`[Socket] ${error}`);
        }
    });

    socket.on("sendPaymentRequest", async (orderId: number, tableId: number, payment_method: string, total: string, email: string) => {
        try {
            const order = await getOrderById(orderId);

            if (order.tableId !== Number(tableId)){
                logger.error(`[Socket] Order does not belong to Table`);
                return;
            }

            const payload: OrderInput = {
                status: OrderStatus.userClosed,
                email: email
            }

            const updated = await updateOrderById(orderId, payload);

            if (updated){
                const request: NeedWaiterRequest = {
                    orderId: orderId,
                    tableId: tableId,
                    message: `PAGO por ${PaymentMethods.getSpanishValue(payment_method)} ${payment_method === PaymentMethods.CARD ? '(Llevar terminal)' : ''} TOTAL: ${total}`
                }
                io.emit('needWaiter', request);
            }else{
                logger.error(`[Socket] Order could not be updated`);
                return;
            }
        } catch (error) {
            logger.error(`[Socket] ${error}`);
        }
    });
};