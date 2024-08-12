import { useEffect } from "react";
import { socket } from "../utils/socketClient";

export interface SocketEvent {
  name: string;
  handler(...args: any[]): any;
}

export function useSocketEvents(events: SocketEvent[]) {
  useEffect(() => {
    for (const event of events) {
      socket.on(event.name, event.handler);
    }

    return function () {
      for (const event of events) {
        socket.off(event.name);
        socket.disconnect()
      }
    };
  }, []);
}
