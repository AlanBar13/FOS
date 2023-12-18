import { Sequelize } from "sequelize";
import env from "../config/env";
import logger from "../utils/logger";

const uri = env.postgresUrl ?? "";

const sequelize = new Sequelize(uri, { logging: env.mode === "dev" ? console.log : false });

const testdb = async () => {
    try {
        await sequelize.authenticate({ logging: false })
        logger.info('[DB] Connection has been established successfully')
    } catch (error) {
        logger.error(`Unable to connect to the database`, error)
    }
}

export { sequelize, testdb }