import { Menu } from "./Menu";

export interface OrderItem {
  id?: number;
  orderId?: number;
  menuId: number;
  qty: number;
  comments?: string;
  status?: string;
  Menu?: Menu;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
