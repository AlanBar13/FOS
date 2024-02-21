export type User = {
    id: number
    username: string
    role: "admin" | "waiter" | "viewer" | "dev"
    createdAt: string
    updatedAt: string | null
}

export type LoginData = {
    token: string
    role: string
}