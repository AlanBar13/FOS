import { useContext, createContext, PropsWithChildren } from "react";
import { api } from "../utils/apiClient";
import { ApiService } from "../services/api.service";
import { MenuService } from "../services/menu.service";
import { TableService } from "../services/table.service";
import { UserService } from "../services/user.service";
import { OrderService } from "../services/order.service";
import { DashboardService } from "../services/dashboard.service";
import { CategoryService } from "../services/categories.service";

const ApiContext = createContext<ApiService | null>(null);

const ApiProvider = ({ children }: PropsWithChildren) => {
  const menuService = new MenuService(api.http);
  const tableService = new TableService(api.http);
  const userService = new UserService(api.http);
  const orderService = new OrderService(api.http);
  const dashboardService = new DashboardService(api.http);
  const categoryService = new CategoryService(api.http);
  const apiService = new ApiService(
    menuService,
    tableService,
    orderService,
    dashboardService,
    userService,
    categoryService,
  );

  return (
    <ApiContext.Provider value={apiService}>{children}</ApiContext.Provider>
  );
};

export default ApiProvider;

export const useApi = () => {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("useApi has to be used within <ApiProvider>");
  }
  return apiContext;
};
