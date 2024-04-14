import { CategoryService } from "./categories.service";
import { DashboardService } from "./dashboard.service";
import { MenuService } from "./menu.service";
import { OrderService } from "./order.service";
import { TableService } from "./table.service";
import { UserService } from "./user.service";

export class ApiService {
  public menu: MenuService;
  public table: TableService;
  public order: OrderService;
  public dashboard: DashboardService;
  public user: UserService;
  public category: CategoryService;

  constructor(
    menuService: MenuService,
    tableService: TableService,
    orderService: OrderService,
    dashboardService: DashboardService,
    userService: UserService,
    categoryService: CategoryService,
  ) {
    this.menu = menuService;
    this.table = tableService;
    this.order = orderService;
    this.dashboard = dashboardService;
    this.user = userService;
    this.category = categoryService;
  }
}
