import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config";
import bcrypt from 'bcryptjs';

interface UserAtributtes {
    id: number
    username: string
    password: string
    role: string
    createdAt?: Date
    deletedAt?: Date
}

class User extends Model<UserAtributtes, UserInput> implements UserAtributtes {
    public id!: number
    public username!: string
    public password!: string
    public role!: string

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;

    async matchPassword(enteredPassword: string): Promise<boolean> {
        return await bcrypt.compare(enteredPassword, this.password);
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM("admin", "waiter", "viewer", "dev"),
        allowNull: false,
        defaultValue: "viewer"
    }
}, {
    timestamps: true,
    sequelize: sequelize,
    paranoid: true
});

User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

export default User;
export interface UserInput extends Optional<UserAtributtes, 'id'>{}
export interface UserOutput extends Required<UserAtributtes>{}