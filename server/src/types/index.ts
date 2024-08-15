import { OrderItem } from "@prisma/client";
import { Request } from "express";
import { Server } from "socket.io";

export interface QueryFilters {
  id?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  includeDeleted?: boolean;
}

export interface MenuQueryFilters {
  available?: boolean;
}

export interface OrderQueryFilters {
  startDate?: Date;
  endDate?: Date;
}

type FeedbackType = "itemAdded" | "itemKitchen" | "itemReady";

export interface ServerToClientEvents {
  noArg: () => void;
  dashboardOrderServer: (newItem: DashboardItems) => void;
  orderUpdateServer: (item: DashboardItems) => void;
  orderReadyServer: (item: DashboardItems) => void;
  needWaiter: (obj: NeedWaiterRequest) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  sendClientFeedback: (
    item: OrderItem[],
    type: FeedbackType,
    orderId: number,
  ) => void;
  orderingStatus: (status: boolean) => void;
}

export interface ClientToServerEvents {
  sendOrder: (server_id: number, table_id: number) => void;
  orderPreparing: (dashboardItem: DashboardItems) => void;
  orderReady: (dashboardItem: DashboardItems) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: string;
}

export interface JWTUser {
  id: number;
  username: string;
  role: string;
}

export interface CustomRequest extends Request {
  user?: JWTUser;
  io?: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
}

export interface AddToDashboardItems {
  orderItemId: number;
  id: number; //menu id
  name: string;
  price: number;
  amount: number;
  total: number;
  status?: string;
  comments?: string;
}

export interface DashboardItems {
  id: string;
  orderId: number;
  tableId: number;
  orderStatus: string;
  items: AddToDashboardItems[];
}

export interface DashboardItemsRespone {
  inProgress: DashboardItems[];
  ordered: DashboardItems[];
}

export interface MostOrderedQueryResult {
  menuId: number;
  magnitude: string;
}

export interface NeedWaiterRequest {
  id: string;
  tableId: number;
  orderId: number;
  message: string;
}
