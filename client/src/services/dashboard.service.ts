import { api } from "../utils/apiClient";
import { DashboardItems } from '../models/SocketModels';

type GetDashboardItemsRes = {
    toPrepare: DashboardItems[]
    inKitchen: DashboardItems[]
}
export const getDashboardItems = async (): Promise<GetDashboardItemsRes> => {
    return (await api.get<GetDashboardItemsRes>('/admin/dashboard')).data;
}