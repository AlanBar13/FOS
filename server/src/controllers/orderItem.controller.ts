import {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import { OrderItemInput } from "../db/models/OrderItem";
import { createOrderItem, getAllOrdersItemsByOrder, getOrderItemById, deleteOrderItemById, updateOrderItemCommentsById, calculateOrderTotal } from '../services/orderItems.service';
import { getOrderById, updateOrderStatsuById, addPriceToOrderById, updateOrderById } from '../services/order.service';
import { getMenuItemById } from '../services/menu.service';
import { OrderStatus, ItemStatus } from '../constants';

export const registerOrderItem = asyncHandler(async (req: Request, res: Response) => {
    const tableId = Number(req.params.tableId);
    const orderId = Number(req.params.orderId);
    const payload: OrderItemInput = req.body;

    payload.orderId = orderId;
    const order = await getOrderById(orderId)

    if (!order){
        res.status(404);
        throw new Error(`Order not found`)
    }

    if (order.status === OrderStatus.deleted || order.status === OrderStatus.paid || order.status === OrderStatus.notPaid || order.status === OrderStatus.userClosed) {
        res.status(400);
        throw new Error(`Order closed`)
    }

    if (order.tableId !== tableId){
        res.status(400);
        throw new Error(`Order does not belong to table`)
    }

    const menuItem = await getMenuItemById(payload.menuId);

    if (!menuItem) {
        res.status(404);
        throw new Error(`Menu Item not foud`)
    }
    
    payload.status = ItemStatus.ordered;
    const item = await createOrderItem(payload);

    if (order.status === OrderStatus.created){
        await updateOrderStatsuById(payload.orderId, OrderStatus.ordering)
    }

    await addPriceToOrderById(payload.orderId, menuItem.price, payload.qty, menuItem.tax ? menuItem.tax : undefined);

    res.json({item, menu: menuItem})
})

export const getItemsByOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = Number(req.params.orderId);

    const items = await getAllOrdersItemsByOrder(orderId);

    res.json(items)
})

export const deleteItemByOrderId = asyncHandler(async (req: Request, res: Response) => {
    const orderId = Number(req.params.orderId);
    const itemId = Number(req.params.itemId);

    const item = await getOrderItemById(itemId);

    if (item.orderId === orderId){
        const deleted = await deleteOrderItemById(itemId);
        if (deleted){
            const [subTotal, taxTotal] = await calculateOrderTotal(orderId);
            console.log(subTotal, taxTotal);
            const total = subTotal + taxTotal;
            await updateOrderById(orderId, {subtotal: subTotal, taxTotal: taxTotal, total: total})
            res.json({"message": `Item ${itemId} was deleted from order ${orderId}`, subTotal, taxTotal, total})
        }else{
            throw new Error(`Item was not deleted`)
        }
    }else{
        res.status(400);
        throw new Error(`Item does not match with order`)
    }
})

export const updateItemCommentsByOrderId = asyncHandler(async (req: Request, res: Response) => {
    const orderId = Number(req.params.orderId);
    const itemId = Number(req.params.itemId);
    const comments = req.body["comments"];

    const item = await getOrderItemById(itemId);

    if (item.orderId === orderId){
        const deleted = await updateOrderItemCommentsById(itemId, comments);
        if (deleted){
            res.json({"message": `Item ${itemId} comments were updated from order ${orderId}`})
        }else{
            throw new Error(`Item was not deleted`)
        }
    }else{
        res.status(400);
        throw new Error(`Item does not match with order`)
    }
})