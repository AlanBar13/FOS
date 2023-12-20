import { OrderItem } from "./OrderItem"

export interface Order {
    id: number
    //items: OrderItem[]
    tableId: number
    subtotal: number
    taxTotal?: number
    total: number
    tips: number
    status: string
    email?: string
    createdAt?: Date
    updatedAt?: Date
}

export interface GetOrder {
    order: Order
    items: OrderItem[]
}
