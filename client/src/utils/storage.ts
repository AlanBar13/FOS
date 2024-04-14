import { DashboardItems } from "../models/SocketModels";

class StorageService {
  dashboardAddList(key: string, list: DashboardItems[]) {
    const savedList = localStorage.getItem(key);
    if (savedList !== null) {
      localStorage.removeItem(key);
    }

    localStorage.setItem(key, JSON.stringify(list));
  }

  getDashboardList(key: string): DashboardItems[] {
    const savedList = localStorage.getItem(key);
    if (savedList !== null) {
      return JSON.parse(savedList) as DashboardItems[];
    } else {
      return [];
    }
  }

  removeDashboardListFromStorage(key: string) {
    localStorage.removeItem(key);
  }
}

const storageService = new StorageService();

export { storageService };
