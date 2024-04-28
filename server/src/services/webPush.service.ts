import webPush from "web-push";
import env from "../config/env";
import { NotificationPayload, ConfigOptions } from "../types";

webPush.setVapidDetails("mailto:alan.g.bardales@gmail.com", env.webPush.publicKey, env.webPush.privateKey);

export class WebPushService {
    async sendNotification(subscription: webPush.PushSubscription, content: NotificationPayload, config: ConfigOptions){
        webPush.sendNotification(subscription, JSON.stringify(content), config)
    }
}