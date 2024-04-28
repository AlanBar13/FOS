export class NotificationService {
    private _notification = window.Notification;
    private _vapidKey: string;

    constructor(vapidKey: string){
        this._vapidKey = vapidKey;
    }

    hasPermission(): boolean {
        return this._notification.permission === "granted";
    }

    async requestPermission(){
        if (!("Notification" in window)){
            throw new Error('Notificaciones no soportadas')
        }

        const permission = await this._notification.requestPermission();

        if (permission !== "granted") {
            throw new Error('Permiso Denegado Notificaciones')
        }
    }

    async getSubscription(): Promise<PushSubscription | null> {
        const registration =  await navigator.serviceWorker.ready;
        return await registration.pushManager.getSubscription();
    }

    async subscribe(): Promise<PushSubscription>{
        const registration =  await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this._vapidKey
        });
        return subscription;
    }

    async unsubscribe(){
        const subscription = await this.getSubscription();
        if (subscription){
            await subscription.unsubscribe();
        }

        return subscription;
    }

    async showNotification(title: string, options?: NotificationOptions) {
        if (!("Notification" in window)){
            throw new Error('Notificaciones no soportadas')
        }

        if (this._notification.permission !== "granted") {
            throw new Error('Permiso Denegado Notificaciones')
        }

        return new this._notification(title, options);
    }
}