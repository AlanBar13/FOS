import http from "http";
import express, { Express } from "express";
import cors from "cors";
import compression from "compression";
import path from 'path';
import dbInit from "./db/init";
import { Server } from "socket.io";

import admMenuRoutes from "./routes/admin/menu.routes";
import admTableRoutes from "./routes/admin/table.routes";
import admOrderRoutes from "./routes/admin/order.routes";
import admUserRoutes from "./routes/admin/user.routes";
import admDashboardRoutes from "./routes/admin/dashboard.routes";
import tableRoutes from "./routes/public/table.routes";
import orderRoutes from "./routes/public/order.routes";
import menuRoutes from './routes/public/menu.routes';
import { authUser } from "./controllers/user.controller";

import logger from "./utils/logger";
import env from "./config/env";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import { onNewWebSocketConnection } from './services/socket.service';
import { PaymentMethods } from './constants';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData, CustomRequest } from './types';

const app: Express = express();
const httpServer = http.createServer(app);

// Socket Logic
export const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, { cors: {origin: "*"} });

io.on("connection", onNewWebSocketConnection);

app.use(compression());
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use((req: CustomRequest, res, next) => {
    req.io = io;
    return next();
})

dbInit();

app.get("/v1/paymentMethods", (req, res) => {
    res.json(PaymentMethods.paymentMethods);
});

app.use("/v1/table", tableRoutes);
app.use("/v1/order", orderRoutes);
app.use("/v1/menu", menuRoutes);
app.post("/v1/login", authUser);
app.use("/v1/admin/menu", admMenuRoutes);
app.use("/v1/admin/order", admOrderRoutes);
app.use("/v1/admin/table", admTableRoutes);
app.use("/v1/admin/user", admUserRoutes);
app.use("/v1/admin/dashboard", admDashboardRoutes);

app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
});

// Middleware
app.use(notFound);
app.use(errorHandler);

const port = env.port;

httpServer.listen(port, () => {
    logger.info(`FOS API server running on port ${port}`);
})

export default app; //testing purposes