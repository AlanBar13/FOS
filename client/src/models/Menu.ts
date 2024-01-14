export interface Menu {
    id?: number
    name: string
    description?: string
    available: boolean
    category?: string
    price: number
    tax?: number
    img?: string
    prepTime?: string
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}