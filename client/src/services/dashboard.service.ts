import { DashboardItems } from "../models/SocketModels";
import { AxiosInstance } from "axios";

type GetDashboardItemsRes = {
  toPrepare: DashboardItems[];
  inKitchen: DashboardItems[];
};

export class DashboardService {
  private _apiService: AxiosInstance;

  constructor(apiService: AxiosInstance) {
    this._apiService = apiService;
  }

  async getDashboardItems(): Promise<GetDashboardItemsRes> {
    return (
      await this._apiService.get<GetDashboardItemsRes>("/admin/dashboard")
    ).data;
  }
}
