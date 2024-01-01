import { RawMenu } from "./Order"

export interface Cart {
    qty: number
    item: RawMenu
    total: number
}

export interface OrderedItems {
    menuId: string
    qty: number
    name: string
    total: number
}