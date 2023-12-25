import { formatPriceFixed } from "../utils/numbers";
import { IBaseModel } from "./IBaseModel";

type RawOrder  = {
    id: number
    tableId: number
    subtotal: number
    taxTotal: number
    total: number
    tips: number
    status: string
    email: string
    createdAt: string
    updatedAt: string
}

type RawMenu = {
    name: string
    price: number
    tax: number
}

type RawOrderItems = {
    id: number
    menuId: number
    orderId: number
    qty: number
    status: string
    Menu: RawMenu
    comments: string | null
}

type GetOrder = {
    order: RawOrder
    items: Array<RawOrderItems>
}

export type OrderItem = {
    menuName: string
    menuPrice: string
    menuTax: string
    total: string
    comments: string | null
    id: number
    menuId: number
    orderId: number
    qty: number
    status: string
}

export type Order = {
    id: number
    tableId: number
    formatedStatus: string
    status: string
    subTotal: string
    taxTotal: string
    total: string
    tips: string
    items?: OrderItem[]
    createdAt: string
    updatedAt: string
}

export class OrderAdapter implements IBaseModel {
    private value: GetOrder;

    constructor(obj: unknown){
        this.value = obj as GetOrder;
        console.log(`adapter value`, this.value)
    }

    get statusText() {
        switch(this.value.order.status){
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

    get subtotal() {
        return formatPriceFixed(this.value.order.subtotal);
    }

    get taxTotal() {
        return formatPriceFixed(this.value.order.taxTotal);
    }

    get total() {
        return formatPriceFixed(this.value.order.total);
    }
    
    get tips() {
        return formatPriceFixed(this.value.order.tips);
    }

    get createdDateFormatted() {
        return new Date(this.value.order.createdAt).toLocaleString();
    }

    get updatedDateFormatted() {
        return new Date(this.value.order.createdAt).toLocaleString();
    }

    adapt() {
        const obj : Order = {
            id: this.value.order.id,
            tableId: this.value.order.tableId,
            status: this.value.order.status,
            formatedStatus: this.statusText,
            subTotal: this.subtotal,
            taxTotal: this.taxTotal,
            total: this.total,
            tips: this.tips,
            items: this.value.items.map(item => {
                const obj: OrderItem = {
                    orderId: item.orderId,
                    id: item.id,
                    menuId: item.menuId,
                    qty: item.qty,
                    menuName: item.Menu.name,
                    menuPrice: formatPriceFixed(item.Menu.price),
                    menuTax: formatPriceFixed(item.Menu.tax),
                    total: formatPriceFixed((item.Menu.price + item.Menu.tax) * item.qty),
                    comments: item.comments,
                    status: this.getOrderItemStatusString(item.status)
                };

                return obj;
            }),
            createdAt: this.createdDateFormatted,
            updatedAt: this.updatedDateFormatted
        };
        return obj;
    }

    private getOrderItemStatusString(status: string) {
        switch(status){
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
}