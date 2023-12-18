import { sequelize } from "../db/config";
import { QueryTypes } from 'sequelize';
import { OrderItem, Menu } from "../db/models";
import { OrderItemInput, OrderItemOutput } from "../db/models/OrderItem";
import { MostOrderedQueryResult } from '../types'

/**
* Create Order Item on DB
*
* @param payload - Order Item attributes
* @returns Order Item from DB
*/
export const createOrderItem = async (payload: OrderItemInput): Promise<OrderItemOutput> => {
    const item = await OrderItem.create(payload);

    return item;
}

/**
* Return all order items
*
* @returns Array of Orders Items
*/
export const getAllOrderItems = async (): Promise<OrderItemOutput[]> => {
    const items = await OrderItem.findAll();

    return items;
}

/**
* Get all Orders Items from DB by order id
*
* @param orderId - Order ID
* @returns Array of Orders Items
*/
export const getAllOrdersItemsByOrder = async (orderId: number, status?: string): Promise<OrderItemOutput[]> => {
    if (status){
        const items = await OrderItem.findAll({
            include: [
                { 
                    model: Menu,
                    attributes: ['name', 'price', 'tax']
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            },
            where: {
                orderId: orderId,
                status
            }
        });
    
        return items;
    }else{
        const items = await OrderItem.findAll({
            include: [
                { 
                    model: Menu,
                    attributes: ['name', 'price', 'tax']
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'deletedAt']
            },
            where: {
                orderId: orderId
            }
        });
    
        return items;
    }
}

/**
* Get Order Item by Order Item ID
*
* @param id - Order Item ID
* @returns Order Item from DB
*/
export const getOrderItemById = async (id: number): Promise<OrderItemOutput> => {
    const item = await OrderItem.findByPk(id);

    if (!item) {
        throw new Error(`Order Not Found`)
    }

    return item;
}

/**
* Update Order Item Comments by Order Item ID
*
* @param id - Order Item ID
* @param payload - Order Item Attributes
* @returns Order Item from DB
*/
export const updateOrderItemCommentsById = async (id: number, comments: string): Promise<OrderItemOutput> => {
    const item = await OrderItem.findByPk(id);

    if (!item) {
        throw new Error(`Order Not Found`)
    }

    const updatedOrder = await item.update({comments});
    return updatedOrder;
}

/**
* Update Order Item Status by Order Item ID
*
* @param id - Order Item ID
* @param status - Order Item Status
* @returns Order Item from DB
*/
export const updateOrderItemStatusById = async (id: number, status: string): Promise<OrderItemOutput> => {
    const item = await OrderItem.findByPk(id);

    if (!item) {
        throw new Error(`[OrderItem] Order Item Not Found`)
    }

    const updatedOrder = await item.update({status});
    return updatedOrder;
}

/**
* Delete Order Item by Order Item ID
*
* @param id - Order Item ID
* @returns True if it was deleted correctly
*/
export const deleteOrderItemById = async (id: number): Promise<boolean> => {
    const deletedCount = await OrderItem.destroy({ where: {id} });

    return !!deletedCount;
}

/**
* Delete Order Item by Order Item ID
*
* @param id - Order Item ID
* @returns True if it was deleted correctly
*/
export const getMostOrderedItem = async (): Promise<MostOrderedQueryResult[]> => {
    const result: MostOrderedQueryResult[] = await sequelize.query('SELECT "menuId", COUNT(*) AS magnitude FROM "OrderItems" GROUP BY "menuId" ORDER BY magnitude DESC', { type: QueryTypes.SELECT });
    return result;
}

/**
* Calculate order total
*
* @param orderId - Order Item ID
* @returns Array of [total, tax]
*/
export const calculateOrderTotal = async (orderId: number): Promise<[number, number]> => {
    let total = 0;
    let tax = 0;
    const items = await OrderItem.findAll({
        include: [
            { 
                model: Menu,
                attributes: ['name', 'price', 'tax']
            }
        ],
        where: {orderId}
    });
    if (items){
        items.forEach((item) => {
            total += item.qty * item.Menu.price;
            tax += item.qty * item.Menu.tax;
        });
    }
    return [total, tax];
}