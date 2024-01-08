export interface AddToDashboardItems {
    orderItemId: number
    id: number //menu id
    name: string
    price: number
    amount: number
    total:number
    status?: string
    comments?: string
}

export interface DashboardItems {
    id: string
    orderId: number
    tableId: number
    orderStatus: string
    items: AddToDashboardItems[]
}

export interface NeedWaiterRequest {
    tableId: number
    orderId: number
    message: string
}

export type FeedbackType = "itemAdded" | "itemKitchen" | "itemReady";