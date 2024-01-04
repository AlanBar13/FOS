import {Socket} from 'socket.io';
import { io } from '../server';
import logger from '../utils/logger';
import db from '../db/client';
import { v4 as uuidv4 } from 'uuid';
import { ItemStatus, OrderStatus, PaymentMethods } from '../constants';
import { AddToDashboardItems, DashboardItems, NeedWaiterRequest } from '../types';
import kitchenQueue from './kitchenQueue.service';

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
        logger.info(`OrderSent order: ${order_id}, table: ${table_id} `)
        try {
            const currentOrder = await db.order.findUnique({ where : { id: order_id }});

            if (currentOrder === null){
                throw new Error(`Order does not exist`);
            }

            if (currentOrder.tableId !== table_id){
                throw new Error(`Order does not belong to Table`);
            }

            if (currentOrder.status === OrderStatus.deleted || currentOrder.status === OrderStatus.notPaid || currentOrder.status === OrderStatus.paid || currentOrder.status === OrderStatus.userClosed){
                throw new Error(`Order closed`);
            }


            if (currentOrder && items){
                const dashboardItem : DashboardItems = {
                    id: uuidv4(),
                    orderId: currentOrder.id,
                    tableId: currentOrder.tableId,
                    orderStatus: OrderStatus.ordering,
                    items
                }
                kitchenQueue.addToQueue(dashboardItem);
                io.emit("dashboardOrderServer", dashboardItem);
            }else{
                throw new Error(`Order could not be updated`)
            }
        } catch (error) {
            logger.error(`[Socket] ${error}`);
        }
    });

    socket.on("orderUpdate", async (dashboardItem: DashboardItems) => {
        console.log("orderUpdate", dashboardItem.id)
        try {
            if (!dashboardItem.items || dashboardItem.items.length === 0){
                throw new Error(`No items sent`);
            }

            await db.order.update({ 
                where: {
                    id: dashboardItem.orderId,
                    tableId: dashboardItem.tableId
                },
                data: {
                    status: OrderStatus.inKitchen
                }
            });

            await Promise.all(dashboardItem.items.map(async (item) => {
                await db.orderItem.update({
                    where: {
                        id: item.orderItemId
                    },
                    data: {
                        inKitchenAt: new Date()
                    }
                })
            }))

            dashboardItem.orderStatus = OrderStatus.inKitchen;
            const updatedItems = dashboardItem.items.map((item) => ({...item, status: ItemStatus.inProgress}));
            dashboardItem.items = updatedItems;
            kitchenQueue.moveToKitchen(dashboardItem);
            io.emit("orderUpdateServer", dashboardItem);
        } catch (error) {
            logger.error(`[Socket] ${error}`);
        }
    });

    socket.on("orderReady", async (dashboardItem: DashboardItems) => {
        console.log("orderReady", dashboardItem.id)
        try {
            if (!dashboardItem.items || dashboardItem.items.length === 0){
                throw new Error(`No items sent`);
            }
            await db.order.update({ 
                where: {
                    id: dashboardItem.orderId,
                    tableId: dashboardItem.tableId
                },
                data: {
                    status: OrderStatus.served
                }
            });

            await Promise.all(dashboardItem.items.map(async (item) => {
                await db.orderItem.update({
                    where: {
                        id: item.orderItemId
                    },
                    data: {
                        doneAt: new Date()
                    }
                })
            }))

            kitchenQueue.orderReady(dashboardItem);
            dashboardItem.orderStatus = OrderStatus.served;
            const updatedItems = dashboardItem.items.map((item) => ({...item, status: ItemStatus.done}));
            dashboardItem.items = updatedItems;
            io.emit("orderReadyServer", dashboardItem);
        } catch (error) {
            logger.error(`[Socket] ${error}`);
        }
    });

    socket.on("sendPaymentRequest", async (orderId: number, tableId: number, payment_method: string, total: string, email: string) => {
        try {
            const order = await db.order.update({
                where: {
                    id: orderId,
                    tableId: tableId
                },
                data: {
                    status: OrderStatus.userClosed,
                    email: email
                }
            })

            const request: NeedWaiterRequest = {
                orderId: order.id,
                tableId: order.tableId,
                message: `PAGO por ${PaymentMethods.getSpanishValue(payment_method)} ${payment_method === PaymentMethods.CARD ? '(Llevar terminal)' : ''} TOTAL: ${order.total}`
            }
            io.emit('needWaiter', request);
        } catch (error) {
            logger.error(`[Socket] ${error}`);
        }
    });
};