import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config";
import Menu from "./Menu";

interface OrderItemAttributes {
    id: number
    orderId: number
    menuId: number
    qty: number
    comments?: string
    status: string
    Menu?: Menu
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

class OrderItem extends Model<OrderItemAttributes, OrderItemInput> implements OrderItemAttributes {
    public id!: number
    public orderId!: number
    public menuId!: number
    public qty!: number
    public comments!: string
    public status!: string
    public Menu!: Menu

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

OrderItem.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    menuId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    comments: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM("ordered", "inProgress", "done"),
        allowNull: false
    }
}, {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true
})

OrderItem.belongsTo(Menu, {foreignKey: 'menuId'});

export default OrderItem;
export interface OrderItemInput extends Optional<OrderItemAttributes, 'id' | 'Menu'>{}
export interface OrderItemOutput extends Optional<OrderItemAttributes, 'Menu'>{}