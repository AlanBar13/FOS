import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config";

interface TableAttributes {
    id: number
    name?: string
    location?: string
    qrcode?: string
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

class Table extends Model<TableAttributes, TableInput> implements TableAttributes {
    public id!: number
    public name!: string
    public location!: string
    public qrcode!: string

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;
}

Table.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING,
    },
    qrcode: {
        type: DataTypes.TEXT,
    },
}, {
    timestamps: true,
    sequelize: sequelize
})

export default Table;
export interface TableInput extends Optional<TableAttributes, 'id'>{}
export interface TableOutput extends Required<TableAttributes>{}