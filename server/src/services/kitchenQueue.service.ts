import { DashboardItems } from "../types";

class KitchenQueue {
    private items: DashboardItems[] = [];

    add(item: DashboardItems): void {
        if (!this.items.some(existing => existing.id === item.id)) {
            this.items.push(item);
        }
    }

    delete(item: DashboardItems): void {
        if (this.items.some(existing => existing.id === item.id)){
            this.items.filter(item => item.id !== item.id);
        }
    }

    update(item: DashboardItems): void {
        if (this.items.some(existing => existing.id === item.id)){
            this.items.filter(item => item.id !== item.id);
            this.items.push(item);
        }
    }

    has(item: DashboardItems): boolean {
        return this.items.some(existing => existing.id === item.id);
    }

    values(): DashboardItems[] {
        return [...this.items];
    }
}

const kitchenQueue = new KitchenQueue();

export default kitchenQueue;