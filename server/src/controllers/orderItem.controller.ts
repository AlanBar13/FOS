import {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import db from "../db/client";
import { OrderItem } from '@prisma/client';
import { OrderStatus, ItemStatus } from '../constants';


export const registerOrderItem = asyncHandler(async (req: Request, res: Response) => {
    const tableId = Number(req.params.tableId);
    const orderId = Number(req.params.orderId);
    const payload: OrderItem = req.body;

    payload.orderId = orderId;
    const order = await db.order.findUnique({ where: { id: orderId }})

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

    const menuItem = await db.menu.findUnique({ where: { id: payload.menuId }});

    if (!menuItem) {
        res.status(404);
        throw new Error(`Menu Item not foud`)
    }
    
    payload.status = ItemStatus.ordered;
    const item = await db.orderItem.create({
        data: {
            ...payload
        },
        include: {
            Menu: true
        }
    });

    if (order.status === OrderStatus.created){
        await db.order.update({ 
            where: { 
                id: payload.orderId 
            },
            data: {
                status: OrderStatus.ordering
            }
        });
    }

    if (menuItem.tax){
        await db.order.update({ 
            where: { 
                id: payload.orderId 
            }, 
            data: {
                subtotal: {
                    increment: (menuItem.price * payload.qty)
                },
                taxTotal: {
                    increment: menuItem.tax
                },
                total: {
                    increment: (menuItem.price + menuItem.tax) * payload.qty
                }
            }
        });
    }else{
        await db.order.update({ 
            where: { 
                id: payload.orderId 
            }, 
            data: {
                subtotal: {
                    increment: (menuItem.price * payload.qty)
                },
                total: {
                    increment: (menuItem.price * payload.qty)
                }
            }
        });
    }

    res.json(item);
})

export const getItemsByOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = Number(req.params.orderId);

    const items = await db.order.findUnique({ 
        where: { 
            id: orderId 
        },
        include: {
            OrderItems: true
        }
    });

    res.json(items?.OrderItems)
})

export const deleteItemByOrderId = asyncHandler(async (req: Request, res: Response) => {
    const orderId = Number(req.params.orderId);
    const itemId = Number(req.params.itemId);

    const deleted = await db.orderItem.delete({ where: { id: itemId, orderId }});
    if (deleted){
        const items = await db.orderItem.findMany({ 
            where: { orderId }, 
            include: {
                Menu: true
            }
        });
        if (items.length > 0){
            let subtotal = 0;
            let tax = 0;
            items.forEach(item => {
                subtotal += item.qty * item.Menu.price;
                if (item.Menu.tax){
                    tax += item.qty * item.Menu.tax;
                }
            });
            const total = subtotal + tax;
            await db.order.update({ 
                where: { 
                    id: orderId 
                }, 
                data: {
                    subtotal,
                    taxTotal: tax,
                    total: total
                }
            });
        }
        res.json({"message": `Item ${itemId} was deleted from order ${orderId}`})
    }else{
        throw new Error(`Item was not deleted`)
    }
})

export const updateItemCommentsByOrderId = asyncHandler(async (req: Request, res: Response) => {
    try {
        const orderId = Number(req.params.orderId);
        const itemId = Number(req.params.itemId);
        const comments = req.body["comments"];

        await db.orderItem.update({ 
            where: { 
                id: itemId, 
                orderId 
            },
            data: {
                comments
            }
        });

        res.json({"message": `Item ${itemId} comments were updated from order ${orderId}`});
    } catch (error) {
        throw new Error("OrderItem not found")
    }
})