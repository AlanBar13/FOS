import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Prisma, enum_Orders_status } from "@prisma/client";
import { OrderStatus, ItemStatus, FoodCategories, ORDERING_ENABLED_KEY } from "../constants";
import { CustomRequest, OrderQueryFilters } from "../types";
import { sendTicketEmail } from "../services/email.service";
import db from "../db/client";
import { excludeFields } from "../db/utils";
import cache from "../utils/cache";
import logger from "../utils/logger";
import orderingService from "../services/ordering.service";

const select = excludeFields<Prisma.OrderFieldRefs>(db.order.fields, ["email"]);

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await db.order.findMany({ orderBy: { id: "desc" } });

  res.json(orders);
});

export const registerOrder = asyncHandler(
  async (req: Request, res: Response) => {
    const orderEnabled = orderingService.orderingState;
    if (!orderEnabled) {
      res.status(403);
      throw new Error(`Server not accepting orders`);
    }

    const tableId = Number(req.params.tableId);

    const existingOrder = await db.order.findFirst({
      where: {
        tableId: tableId,
        status: {
          notIn: ["paid", "deleted", "notPaid", "userClosed"],
        },
      },
    });

    if (existingOrder !== null) {
      res.status(400);
      throw new Error(`Already an active order for this table`);
    }

    const order = await db.order.create({
      data: {
        tableId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        OrderItems: {
          include: {
            Menu: true,
          },
        },
      },
    });

    res.json(order);
  },
);

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const order = await db.order.findUnique({
    where: { id },
    include: {
      OrderItems: {
        include: {
          Menu: true,
        },
      },
    },
  });

  res.json(order);
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const payload: Prisma.OrderUpdateInput = req.body;

  const updatedOrder = await db.order.update({ where: { id }, data: payload });

  res.json(updatedOrder);
});

export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const deleted = await db.order.delete({ where: { id } });

  if (deleted) {
    res.json({ message: `Menu Item ${id} deleted successfully` });
  } else {
    throw new Error(`Could not delete Menu Item ${id}`);
  }
});

export const submitOrderToKitchen = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      const orderId = Number(req.params.orderId);
      const tableId = Number(req.params.tableId);
      const itemIds: Array<number> = req.body.itemsIds;

      if (!itemIds || itemIds.length === 0) {
        res.status(400);
        throw new Error(`No itemIds sent`);
      }

      await db.order.update({
        where: {
          id: orderId,
          tableId,
        },
        data: {
          status: OrderStatus.inKitchen,
        },
      });

      await db.orderItem.updateMany({
        where: { orderId },
        data: {
          status: ItemStatus.inProgress,
        },
      });
      res.json({ message: `Order ${orderId}, is being prepared in Kitchen` });
    } catch (error) {
      throw new Error(`Order cannot be updated ${error}`);
    }
  },
);

export const changeOrderToReady = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const id = Number(req.params.id);

    const order = await db.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      res.status(404);
      throw new Error(`Order does not exist`);
    }

    if (order.status === OrderStatus.inKitchen) {
      await db.order.update({
        where: {
          id,
        },
        data: {
          status: OrderStatus.served,
        },
      });

      await db.orderItem.updateMany({
        where: { orderId: id },
        data: {
          status: ItemStatus.done,
        },
      });
    } else {
      res.status(400);
      throw new Error(`Order not in kitchen status`);
    }

    res.json({ message: `Orders updated` });
  },
);

export const isOrderActive = asyncHandler(
  async (req: Request, res: Response) => {
    const tableId = Number(req.params.tableId);

    const activeOrder = await db.order.findFirst({
      where: {
        tableId,
        status: {
          notIn: ["paid", "deleted", "notPaid", "userClosed"],
        },
      },
      include: {
        OrderItems: {
          include: {
            Menu: true,
          },
        },
      },
    });

    if (activeOrder) {
      res.json(activeOrder);
    } else {
      res.status(202);
      res.json({ message: "No active order" });
    }
  },
);

export const closeOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderId = Number(req.params.orderId);
  const tableId = Number(req.params.tableId);
  const emails: string[] = req.body.emails;

  const updated = await db.order.update({
    where: {
      id: orderId,
      tableId,
    },
    data: {
      status: OrderStatus.userClosed,
    },
    include: {
      OrderItems: {
        include: {
          Menu: true,
        },
      },
    },
  });

  if (updated) {
    if (emails && emails.length > 0) {
      await sendTicketEmail(emails, updated, updated.OrderItems);
    }
    res.json({ message: `Order ${orderId} closed sucessfully` });
  } else {
    throw new Error(`Order could not be updated`);
  }
});

export const getOrderWithItems = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const order = await db.order.findUnique({
      where: {
        id,
      },
      include: {
        OrderItems: {
          include: {
            Menu: true,
          },
        },
      },
    });

    res.json(order);
  },
);

export const changeOrderStatusAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const status = req.params.status;

    if (
      !Object.values(enum_Orders_status).includes(status as enum_Orders_status)
    ) {
      res.status(400);
      throw new Error(`Unknown status`);
    }

    const updated = await db.order.update({
      where: {
        id,
      },
      data: {
        status: status as enum_Orders_status,
      },
    });

    res.json(updated);
  },
);

export const orderingStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const orderEnabled = orderingService.orderingState;
    res.json(orderEnabled)
  },
);

export const toggleOrderingState = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const orderEnabled = orderingService.orderingState;

    if (orderEnabled) {
      orderingService.disableOrdering();
      req.io?.emit("orderingStatus", false);
    }else{
      orderingService.enableOrdering();
      req.io?.emit("orderingStatus", true)
    }

    res.json({ message: `Order set to ${!orderEnabled ? 'enabled': 'disabled'}`})
  },
);