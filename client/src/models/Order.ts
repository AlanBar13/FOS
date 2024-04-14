export type RawOrder = {
  id: number;
  tableId: number;
  subtotal: number;
  taxTotal: number;
  total: number;
  tips: number;
  status: string;
  email: string;
  OrderItems?: RawOrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type RawMenu = {
  id: number;
  name: string;
  price: number;
  tax: number | null;
  available: boolean;
  description: string | null;
  img: string | null;
  prepTime: string | null;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type RawOrderItem = {
  id: number;
  orderId: number;
  menuId: number;
  qty: number;
  comments: string | null;
  status: string;
  Menu: RawMenu;
};

export type AddItemToOrder = {
  menuId: number;
  qty: number;
  comments?: string | null;
};

export type UpdateOrder = {
  status: string;
  tips: number;
};

export type OrderItem = {
  menuName: string;
  menuPrice: string;
  menuTax: string;
  total: string;
  comments: string | null;
  id: number;
  menuId: number;
  orderId: number;
  qty: number;
  status: string;
  Menu?: RawMenu;
};

export type Order = {
  id: number;
  tableId: number;
  formatedStatus: string;
  status: string;
  subTotal: string;
  taxTotal: string;
  total: string;
  tips: string;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type GetOrder = {
  order: RawOrder;
  items: Array<RawOrderItem>;
};

export function getOrderStatusSring(status: string): string {
  switch (status) {
    case "created":
      return "Creado";
    case "paid":
      return "Pagado";
    case "notPaid":
      return "No Pagado";
    case "deleted":
      return "Eliminado";
    case "ordering":
      return "Ordenado";
    case "inKitchen":
      return "En cocina";
    case "served":
      return "Servido";
    case "userClosed":
      return "Cerrado x Usuario";
    default:
      return "Desconocido";
  }
}

export function getOrderItemStatusString(status: string) {
  switch (status) {
    case "ordered":
      return "Ordenado";
    case "inProgress":
      return "En Progreso";
    case "done":
      return "Listo";
    default:
      return "Desconocido";
  }
}
