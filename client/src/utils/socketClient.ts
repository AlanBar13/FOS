import { io } from 'socket.io-client';

const url = import.meta.env.VITE_SOCKET_URL;

export const socket = io(url);

export class SocketEvents {
    static serverDashOrder = "dashboardOrderServer";
    static serverUpdateDashOrder = "orderUpdateServer";
    static clientSendOrder = "sendOrder";
    static clientUpdateOrder = "orderUpdate";
    static clientOrderReady = "orderReady";
    static serverOrderReady = "orderReadyServer";
}