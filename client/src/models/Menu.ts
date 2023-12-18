export interface Menu {
    id?: number
    name: string
    description?: string
    available: boolean
    category?: string
    price: number
    tax?: number
    img?: string
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}