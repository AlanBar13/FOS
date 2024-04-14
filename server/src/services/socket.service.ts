import { Socket } from "socket.io";
import { io } from "../server";
import logger from "../utils/logger";
import db from "../db/client";
import { v4 as uuidv4 } from "uuid";
import { ItemStatus, OrderStatus, PaymentMethods } from "../constants";
import {
  AddToDashboardItems,
  DashboardItems,
  NeedWaiterRequest,
} from "../types";
import kitchenQueue from "./kitchenQueue.service";
import { Prisma } from "@prisma/client";

const orderItemsWithMenu = Prisma.validator<Prisma.OrderItemDefaultArgs>()({
  include: { Menu: true },
});
type OrderItemWithMenu = Prisma.OrderItemGetPayload<typeof orderItemsWithMenu>;

export const onlineClients = new Set();

export const onNewWebSocketConnection = async (socket: Socket) => {
  logger.info(`Socket ${socket.id} has connected`);
  onlineClients.add(socket.id);

  socket.on("join", (room: string) => {
    logger.info(`Client ${socket.id} joined room ${room}`);
    socket.join(room);
    socket.to(room).emit("roomConnected", `Connected to room ${room}`);
  });

  socket.on("connect", () => {
    socket.emit("id", socket.id);
  });

  socket.on("disconnect", () => {
    onlineClients.delete(socket.id);
    logger.info(`Socket ${socket.id} has disconnected`);
  });

  // More socket logic
  socket.on(
    "sendOrder",
    async (order_id: number, table_id: number, items: OrderItemWithMenu[]) => {
      logger.info(`OrderSent order: ${order_id}, table: ${table_id} `);
      try {
        const currentOrder = await db.order.findUnique({
          where: { id: order_id },
        });

        if (currentOrder === null) {
          throw new Error(`Order does not exist`);
        }

        if (currentOrder.tableId !== table_id) {
          throw new Error(`Order does not belong to Table`);
        }

        if (
          currentOrder.status === OrderStatus.deleted ||
          currentOrder.status === OrderStatus.notPaid ||
          currentOrder.status === OrderStatus.paid ||
          currentOrder.status === OrderStatus.userClosed
        ) {
          throw new Error(`Order closed`);
        }

        if (currentOrder && items) {
          let newItems: AddToDashboardItems[] = [];
          items.map((item) =>
            newItems.push({
              orderItemId: item.id,
              id: item.Menu.id,
              name: item.Menu.name,
              price: item.Menu.price,
              amount: item.qty,
              status: item.status,
              total: item.qty * item.Menu.price,
            }),
          );
          const dashboardItem: DashboardItems = {
            id: uuidv4(),
            orderId: currentOrder.id,
            tableId: currentOrder.tableId,
            orderStatus: OrderStatus.ordering,
            items: newItems,
          };
          kitchenQueue.addToQueue(dashboardItem);
          io.emit("dashboardOrderServer", dashboardItem);
          io.to(`table:${dashboardItem.tableId}`).emit(
            "sendClientFeedback",
            items,
            "itemAdded",
            order_id,
          );
        } else {
          throw new Error(`Order could not be updated`);
        }
      } catch (error) {
        logger.error(`[Socket] ${error}`);
      }
    },
  );

  socket.on("orderUpdate", async (dashboardItem: DashboardItems) => {
    console.log("orderUpdate", dashboardItem.id);
    try {
      if (!dashboardItem.items || dashboardItem.items.length === 0) {
        throw new Error(`No items sent`);
      }

      await db.order.update({
        where: {
          id: dashboardItem.orderId,
          tableId: dashboardItem.tableId,
        },
        data: {
          status: OrderStatus.inKitchen,
        },
      });

      let orderItems: OrderItemWithMenu[] = [];
      await Promise.all(
        dashboardItem.items.map(async (item) => {
          const orderItem = await db.orderItem.update({
            where: {
              id: item.orderItemId,
            },
            data: {
              status: "inProgress",
              inKitchenAt: new Date(),
            },
            include: {
              Menu: true,
            },
          });
          orderItems.push(orderItem);
        }),
      );

      dashboardItem.orderStatus = OrderStatus.inKitchen;
      const updatedItems = dashboardItem.items.map((item) => ({
        ...item,
        status: ItemStatus.inProgress,
      }));
      dashboardItem.items = updatedItems;
      kitchenQueue.moveToKitchen(dashboardItem);
      io.emit("orderUpdateServer", dashboardItem);
      io.to(`table:${dashboardItem.tableId}`).emit(
        "sendClientFeedback",
        orderItems,
        "itemKitchen",
        dashboardItem.orderId,
      );
    } catch (error) {
      logger.error(`[Socket] ${error}`);
    }
  });

  socket.on("orderReady", async (dashboardItem: DashboardItems) => {
    console.log("orderReady", dashboardItem.id);
    try {
      if (!dashboardItem.items || dashboardItem.items.length === 0) {
        throw new Error(`No items sent`);
      }
      await db.order.update({
        where: {
          id: dashboardItem.orderId,
          tableId: dashboardItem.tableId,
        },
        data: {
          status: OrderStatus.served,
        },
      });

      await Promise.all(
        dashboardItem.items.map(async (item) => {
          await db.orderItem.update({
            where: {
              id: item.orderItemId,
            },
            data: {
              status: "done",
              doneAt: new Date(),
            },
          });
        }),
      );

      kitchenQueue.orderReady(dashboardItem);
      dashboardItem.orderStatus = OrderStatus.served;
      const updatedItems = dashboardItem.items.map((item) => ({
        ...item,
        status: ItemStatus.done,
      }));
      dashboardItem.items = updatedItems;
      io.emit("orderReadyServer", dashboardItem);
    } catch (error) {
      logger.error(`[Socket] ${error}`);
    }
  });

  socket.on(
    "sendPaymentRequest",
    async (
      orderId: number,
      tableId: number,
      payment_method: string,
      total: string,
      email: string,
    ) => {
      try {
        const order = await db.order.update({
          where: {
            id: orderId,
            tableId: tableId,
          },
          data: {
            status: OrderStatus.userClosed,
            email: email,
          },
        });

        const request: NeedWaiterRequest = {
          orderId: order.id,
          tableId: order.tableId,
          message: `PAGO por ${PaymentMethods.getSpanishValue(payment_method)} ${payment_method === PaymentMethods.CARD ? "(Llevar terminal)" : ""} TOTAL: ${order.total}`,
        };
        io.emit("needWaiter", request);
      } catch (error) {
        logger.error(`[Socket] ${error}`);
      }
    },
  );
};
