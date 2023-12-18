import {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import { OrderInput } from "../db/models/Order";
import { getAllOrders, getOrderById, createOrder, updateOrderById, deleteOrderById, updateOrderStatsuById, checkIfActiveOrderForTable } from '../services/order.service';
import { getAllOrdersItemsByOrder, updateOrderItemStatusById, getMostOrderedItem } from '../services/orderItems.service';
import { getMenuItemById } from '../services/menu.service';
import { OrderStatus, ItemStatus, FoodCategories } from '../constants';
import { CustomRequest, OrderQueryFilters } from "../types";
import { sendTicketEmail } from "../services/email.service";

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await getAllOrders();

    res.json(orders)
})

export const registerOrder = asyncHandler(async (req: Request, res: Response) => {
    const tableId = Number(req.params.tableId);

    const order = await createOrder(tableId);

    res.json(order)
})

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const order = await getOrderById(id);

    res.json(order)
})

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload: OrderInput = req.body;

    const updatedOrder = await updateOrderById(id, payload);

    res.json(updatedOrder)
})

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const deleted = await deleteOrderById(id);

    if (deleted){
        res.json({"message": `Menu Item ${id} deleted successfully`})
    }else{
        throw new Error(`Could not delete Menu Item ${id}`)
    }
})

export const submitOrderToKitchen = asyncHandler(async (req: CustomRequest, res: Response) => {
    const orderId = Number(req.params.orderId);
    const tableId = Number(req.params.tableId);
    const itemIds: Array<number> = req.body.itemsIds;

    if (!itemIds || itemIds.length === 0){
        res.status(400);
        throw new Error(`No itemIds sent`)
    }

    const order = await getOrderById(orderId);

    if (order.tableId !== tableId){
        res.status(400);
        throw new Error(`Order does not belong to Table`)
    }

    const updated = await updateOrderStatsuById(orderId, OrderStatus.inKitchen);

    if (updated){
        await Promise.all(
            itemIds.map(async (id) => {
                await updateOrderItemStatusById(id, ItemStatus.inProgress);
            })
        )
        res.json({"message": `Order ${orderId}, is being prepared in Kitchen`})
    }else{
        throw new Error(`Order could not be updated`)
    }
})

export const changeOrderToReady = asyncHandler(async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);

    const order = await getOrderById(id);

    if(!order){
        res.status(404);
        throw new Error(`Order does not exist`);
    }


    if (order.status === OrderStatus.inKitchen){
        const items = await getAllOrdersItemsByOrder(id);

        Promise.all(
            items.map(async (item) => {
                if (item.status !== ItemStatus.done){
                    await updateOrderItemStatusById(item.id, ItemStatus.done);
                }
            })
        );

        await updateOrderStatsuById(id, OrderStatus.served);
    }else {
        res.status(400)
        throw new Error(`Order not in kitchen status`);
    }

    res.json({"message": `Orders updated`})
})

export const isOrderActive = asyncHandler(async (req: Request, res: Response) => {
    const tableId = Number(req.params.tableId);

    const activeOrder = await checkIfActiveOrderForTable(tableId);

    if (activeOrder){
        const orderItems = await getAllOrdersItemsByOrder(activeOrder);
        if (orderItems){
            res.json({"orderId": activeOrder, "items": orderItems })
        }else{
            res.json({"orderId": activeOrder, "items": [] })
        }
    }else{
        res.status(202);
        res.json({"message": "No active order" })
    }
})

export const closeOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = Number(req.params.orderId);
    const tableId = Number(req.params.tableId);
    const emails: string[] = req.body.emails;

    const order = await getOrderById(orderId);

    if (order.tableId !== tableId){
        res.status(400);
        throw new Error(`Order does not belong to Table`)
    }

    const updated = await updateOrderStatsuById(orderId, OrderStatus.userClosed);

    if (updated){
        const orderItems = await getAllOrdersItemsByOrder(orderId);
        if (emails && emails.length > 0){
            await sendTicketEmail(emails, updated, orderItems);
        }
        res.json({"message": `Order ${orderId} closed sucessfully`})
    }else{
        throw new Error(`Order could not be updated`)
    }
})

export const getOrderSummary = asyncHandler(async (req: Request, res: Response) => {
    const result = {
        mostOrdered: "",
        totalToday: 0,
        ordersToday: 0,
        orderClosed: 0
    }

    const mostOrdered = await getMostOrderedItem();
    if(mostOrdered && mostOrdered.length > 0){
        for(let i = 0; i <= mostOrdered.length; i++){
            const menuItem = await getMenuItemById(mostOrdered[i].menuId);
            if (menuItem.category !== FoodCategories.drinks && menuItem.category !== FoodCategories.dessert){
                result.mostOrdered = menuItem.name;
                break;
            }
        }
    }

    const filters: OrderQueryFilters = {
        startDate: new Date()
    }
    const orders = await getAllOrders(filters);
    if (orders.length > 0){
        result.ordersToday = orders.length;
        let total = 0;
        let closed = 0;
        orders.map((order) => {
            if (order.status === OrderStatus.paid){
                total += order.total;
                closed += 1;
            }
        });
        result.totalToday = total;
        result.orderClosed = closed;
    }
    
    res.json(result)
})

export const getOrderWithItems = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const order = await getOrderById(id);
    const items = await getAllOrdersItemsByOrder(id);

    res.json({order, items})
})

export const changeOrderStatusAdmin = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const status = req.params.status

    const updated = await updateOrderStatsuById(id, status);

    res.json(updated);
})