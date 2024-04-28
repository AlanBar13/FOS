import { useContext, createContext, PropsWithChildren } from "react";
import { NotificationService } from "../services/notifications.service";

const NotificationContext = createContext<NotificationService | null>(null);

const NotifactionProvider = ({ children }: PropsWithChildren) => {
    let key = import.meta.env.VITE_VAPID_KEY;
    const notificationService = new NotificationService(key);

    return (
        <NotificationContext.Provider value={notificationService}>{children}</NotificationContext.Provider>
    )
}

export default NotifactionProvider;

export const useNotification = () => {
    const notificationContext = useContext(NotificationContext);
    if (!notificationContext){
        throw new Error("useNotification has to be used within <NotificationProvider>");
    }
    return notificationContext;
}