import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config";

interface MenuAttributes {
    id: number
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

class Menu extends Model<MenuAttributes, MenuInput> implements MenuAttributes {
    public id!: number
    public name!: string
    public description!: string
    public available!: boolean
    public category!: string
    public price!: number
    public tax!: number
    public img!: string

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Menu.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    category: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    tax: {
        type: DataTypes.FLOAT,
    },
    img: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true
})

export default Menu;
export interface MenuInput extends Optional<MenuAttributes, 'id'>{}
export interface MenuOutput extends Required<MenuAttributes>{}
