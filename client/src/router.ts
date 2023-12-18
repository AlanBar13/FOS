import {createBrowserRouter} from 'react-router-dom';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AdminPage from './pages/AdminPage';
import ErrorPage from './pages/ErrorPage';

// Admin routes components
import DashboardComponent from './components/AdminPage/DashboardComponent';
import MenuComponent from './components/AdminPage/MenuComponent';
import OrdersComponent from './components/AdminPage/OrdersComponent';
import TablesComponent from './components/AdminPage/TablesComponent';
import UsersComponent from './components/AdminPage/UsersComponent';

const router = createBrowserRouter([
    {
        path: "/",
        Component: HomePage
    },
    {
        path: "/menu",
        Component: MenuPage
    },
    {
        path: "/admin",
        Component: AdminPage,
        children: [
            {
                path: "dashboard",
                Component: DashboardComponent
            },
            {
                path: "menu",
                Component: MenuComponent
            },
            {
                path: "orders",
                Component: OrdersComponent
            },
            {
                path: "tables",
                Component: TablesComponent
            },
            {
                path: "users",
                Component: UsersComponent
            }
        ]
    },
    {
        path: "*",
        Component: ErrorPage
    }
]);

export default router;