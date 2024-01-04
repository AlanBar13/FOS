import { DashboardItems } from "../types";
import _ from "lodash";

type QueueType = "toPrepare" | "inKitchen";

//TODO: save this to db ex. Mongo/Redis
class KitchenQueue {
    private ordersToPrepare: DashboardItems[] = [];
    private ordersInKitchen: DashboardItems[] = [];

    addToQueue(item: DashboardItems): void {
        if (!this.has(item, "toPrepare") && !this.has(item, "inKitchen")) {
            this.ordersToPrepare.push(item);
        }
        console.log('preparing', this.ordersToPrepare);
        console.log('kitchen', this.ordersInKitchen);
    }

    moveToKitchen(item: DashboardItems): void {
        if (this.has(item, "toPrepare")){
            _.remove(this.ordersToPrepare, (it) => it.id === item.id)
        }

        if(!this.has(item, "inKitchen")){
            this.ordersInKitchen.push(item);
        }
        console.log('preparing', this.ordersToPrepare);
        console.log('kitchen', this.ordersInKitchen);
    }

    orderReady(item: DashboardItems): void {
        if(this.has(item, "inKitchen")){
             _.remove(this.ordersInKitchen, (it) => it.id === item.id);
        }
        console.log('preparing', this.ordersToPrepare);
        console.log('kitchen', this.ordersInKitchen);
    }

    has(item: DashboardItems, type: QueueType): boolean {
        return type === "toPrepare" ? this.ordersToPrepare.some(existing => existing.id === item.id) : this.ordersInKitchen.some(existing => existing.id === item.id);
    }

    values(type: QueueType): DashboardItems[] {
        return type === "toPrepare" ? [...this.ordersToPrepare] : [...this.ordersInKitchen];
    }
}

const kitchenQueue = new KitchenQueue();

export default kitchenQueue;