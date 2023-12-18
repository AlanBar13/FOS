import { Op } from "sequelize";
import { Order } from "../db/models";
import { OrderInput, OrderOutput } from "../db/models/Order";
import { getAllOrdersItemsByOrder } from "./orderItems.service";
import { AddToDashboardItems, DashboardItems, DashboardItemsRespone, OrderQueryFilters } from "../types";
import { ItemStatus } from "../constants";

/**
* Create Order on DB
*
* @param payload - Order attributes
* @returns Order from DB
*/
export const createOrder = async (tableId: number): Promise<OrderOutput> => {
    const newOrder = await Order.create({ tableId });

    return newOrder;
}

/**
* Get all Orders from DB
*
* @param filters - filters for Query (disabled)
* @returns Array of Orders
*/
export const getAllOrders = async (filters?: OrderQueryFilters): Promise<OrderOutput[]> => {
    let orders: OrderOutput[] = [];
    if (filters){
        const NOW = new Date();
        const TODAY_START = new Date().setHours(7,0,0,0);
        orders = await Order.findAll({
            where: {
                createdAt: {
                    [Op.gt]: TODAY_START,
                    [Op.lt]: NOW
                }
            }
        })
    }else {
        orders = await Order.findAll();
    }

    return orders;
}

/**
* Get Order by Order ID
*
* @param id - Order ID
* @returns Order from DB
*/
export const getOrderById = async (id: number): Promise<OrderOutput> => {
    const order = await Order.findByPk(id);

    if (!order) {
        throw new Error(`Order Not Found`)
    }

    return order;
}

/**
* Update Order by Order ID
*
* @param id - Order ID
* @param payload - Order Attributes
* @returns Order from DB
*/
export const updateOrderById = async (id: number, payload: OrderInput): Promise<OrderOutput> => {
    const order = await Order.findByPk(id);

    if (!order) {
        throw new Error(`Order Not Found`)
    }

    const updatedOrder = await order.update(payload);
    return updatedOrder;
}

/**
* Delete Order by Order ID
*
* @param id - Order ID
* @returns True if it was deleted correctly
*/
export const deleteOrderById = async (id: number): Promise<boolean> => {
    const deletedCount = await Order.destroy({ where: {id} });

    return !!deletedCount;
}

/**
* Add price to Order by Order ID
*
* @param id - Order ID
* @param price - Price of item
* @param qty - Quantity
* @param tax - Tax of item
*/
export const addPriceToOrderById = async (id: number, price: number, qty: number, tax?: number) => {
    if (tax){
        const fullPrice = (price + tax) * qty;
        await Order.increment({ subtotal: (price * qty), taxTotal: tax, total: fullPrice }, { where: { id }});
    }else { 
        await Order.increment({ subtotal: (price * qty), total: (price * qty) }, { where: { id }});
    }
}

/**
* Update Order status by Order ID
*
* @param id - Order ID
* @param status - New Order status
* @returns Order from DB
*/
export const updateOrderStatsuById = async (id: number, status: string): Promise<OrderOutput> => {
    const order = await Order.findByPk(id);

    if (!order) {
        throw new Error(`[Order] Order Not Found`)
    }

    const updatedOrder = await order.update({ status });
    return updatedOrder;
}

/**
* Check if Table has active order
*
* @param tableId - Table ID
* @returns Returns true if an order is active for the specified table
*/
export const checkIfActiveOrderForTable = async (tableId: number): Promise<number | null> => {
    const order = await Order.findOne({ 
        where: {
            tableId: tableId,
            status: {
                [Op.notIn]: ['paid', 'not-paid', 'deleted', 'user-closed']
            }
        }
    });

    if (!order) {
        return null;
    }else{
        return order.id;
    }
}

/**
* Get all active Dashboard Items
*
* @returns Returns all active dashboard items
*/
export const activeDashboardItems = async (): Promise<DashboardItemsRespone> => {
    const TODAY_START = new Date().setHours(7,0,0,0);
    const NOW = new Date();
    const orders = await Order.findAll({ 
        where: {
            status: {
                [Op.notIn]: ['paid', 'not-paid', 'deleted', 'user-closed', 'served'],
            },
            updatedAt: {
                [Op.gt]: TODAY_START,
                [Op.lt]: NOW
            }
        }
    });

    const inProgress: DashboardItems[] = [];
    const ordered: DashboardItems[] = [];

    await Promise.all(
        orders.map(async order => {
            const inProgressItems = await getAllOrdersItemsByOrder(order.id, ItemStatus.inProgress);
            if (inProgressItems.length > 0){
                const dashboardInProgressOrderItems = inProgressItems.map((item) => {
                    const addToDashboardOrderItem: AddToDashboardItems = {
                        orderItemId: item.id,
                        id: item.Menu!.id,
                        name: item.Menu!.name,
                        price: item.Menu!.price,
                        amount:item.qty,
                        total: item.Menu!.price * item.qty,
                        status: item.status,
                        comments: item.comments
                    }
    
                    return addToDashboardOrderItem;
                });
                const obj: DashboardItems = {
                    id: `${order.id}_${order.tableId}_${Date.now()}`,
                    orderId: order.id,
                    tableId: order.tableId,
                    orderStatus: order.status,
                    items: dashboardInProgressOrderItems!
                }
                inProgress.push(obj);
            }
            const orderedItems = await getAllOrdersItemsByOrder(order.id, ItemStatus.ordered);
            if (orderedItems.length > 0){
                const dashboardOrderedOrderItems = orderedItems.map((item) => {
                    const addToDashboardOrderItem: AddToDashboardItems = {
                        orderItemId: item.id,
                        id: item.Menu!.id,
                        name: item.Menu!.name,
                        price: item.Menu!.price,
                        amount:item.qty,
                        total: item.Menu!.price * item.qty,
                        status: item.status,
                        comments: item.comments
                    }
    
                    return addToDashboardOrderItem;
                });
                const obj2: DashboardItems = {
                    id: `${order.id}_${order.tableId}_${Date.now()}`,
                    orderId: order.id,
                    tableId: order.tableId,
                    orderStatus: order.status,
                    items: dashboardOrderedOrderItems
                }
                ordered.push(obj2);
            }
        })
    )

    return { inProgress, ordered };
}