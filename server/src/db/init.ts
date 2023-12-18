import { Menu, Order, Table, OrderItem, User } from "./models";
import env from "../config/env";

const isDev = env.mode === "dev";

const dbInit = () => {
    Menu.sync({ alter: isDev });
    Table.sync({ alter: isDev });
    Order.sync({ alter: isDev });
    OrderItem.sync({ alter: isDev });
    User.sync({ alter: isDev });
}

export default dbInit;