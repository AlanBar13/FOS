export type User = {
    id: number
    username: string
    role: "admin" | "waiter" | "viewer" | "dev"
    createdAt: Date
    updatedAt: string | null
}

export type LoginData = {
    token: string
    role: string
}