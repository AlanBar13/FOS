import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config";

interface OrderAttributes {
    id: number
    tableId: number
    subtotal?: number
    taxTotal?: number
    total?: number
    tips: number
    status?: string
    email?: string
    createdAt?: Date
    updatedAt?: Date
}

class Order extends Model<OrderAttributes, OrderInput> implements OrderAttributes {
    public id!: number
    public tableId!: number
    public subtotal!: number
    public taxTotal!: number
    public total!: number
    public tips!: number
    public status!: string
    public email!: string

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tableId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subtotal: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    taxTotal: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    total: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM("created", "paid", "notPaid", "deleted", "ordering", "inKitchen", "served", "userClosed"),
        allowNull: false,
        defaultValue: "created"
    },
    email: {
        type: DataTypes.STRING,
    },
    tips: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    }
}, {
    timestamps: true,
    sequelize: sequelize
})

export default Order;
export interface OrderInput extends Optional<OrderAttributes, 'id'| 'tableId' | 'tips'>{}
export interface OrderOutput extends Required<OrderAttributes>{}