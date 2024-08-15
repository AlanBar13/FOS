import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { useApi } from "../../hooks/ApiProvider";
import { useAlert } from '../../hooks/useAlert';
import { SocketEvent, useSocketEvents } from "../../hooks/useSocketEvents";
import { SocketEvents } from '../../utils/socketClient';

import DrawerItem from "./DrawerItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import GroupIcon from "@mui/icons-material/Group";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from '@mui/icons-material/Settings';

interface AdminDrawerProps {
  drawerWidth: number;
}

const pages = [
  {
    title: "Dashboard",
    route: "/admin/dashboard",
    icon: <DashboardIcon />,
    for: []
  },
  {
    title: "Menu",
    route: "/admin/menu",
    icon: <RestaurantIcon />,
    for: ["admin", "dev"]
  },
  {
    title: "Ordenes",
    route: "/admin/orders",
    icon: <BorderColorIcon />,
    for: ["admin", "dev"]
  },
  {
    title: "Mesas",
    route: "/admin/tables",
    icon: <TableRestaurantIcon />,
    for: []
  },
];

export default function AdminDrawer({ drawerWidth = 240 }: AdminDrawerProps) {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const auth = useAuth();
  const api = useApi();
  const [orderingState, setOrderingState] = useState(true);
  const [loading, setLoading] = useState(false);

  const events: SocketEvent[] = [
    {
      name: SocketEvents.orderingStatus,
      handler(state: boolean) {
        setOrderingState(state);
      },
    }
  ];

  useSocketEvents(events);

  useEffect(() => {
    const fetchState = async () => {
      try {
        setLoading(true);
        const response = await api.order.fetchOrdersStatus();
        setOrderingState(response);
      } catch (error) {
        showAlert("Error en el servidor", "error");
      }
      setLoading(false);
    }
    fetchState();
  }, [])

  const logout = () => {
    auth.logOut();
  };

  const navigateToRoute = (path: string) => {
    return navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
      }}
    >
      <IconButton onClick={() => navigateToRoute("/admin/dashboard")}>
        <Avatar sx={{ bgcolor: loading ? 'black' : orderingState ? 'green' : 'red'}}>FOS</Avatar>
      </IconButton>
      <Divider />
      <List>
        {pages.map((page) =>{
          if (page.for.length === 0 || page.for.includes(auth.role)) {
            return <DrawerItem key={page.title} title={page.title} route={page.route} icon={page.icon} navigateTo={navigateToRoute} />
          }else{
            return null;
          }
        })}
      </List>
      <Divider />
      <List>
        {auth.role === "admin" || auth.role === "dev" ? (
          <>
            <DrawerItem title="Usuarios" route="/admin/users" icon={<GroupIcon />} navigateTo={navigateToRoute} />
            <DrawerItem title="Tools" route="/admin/tools" icon={<SettingsIcon />} navigateTo={navigateToRoute} />
          </>
        ) : null}
        <Tooltip title="Cerrar Sesion" placement="right">
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: "center",
                px: 2.5,
              }}
              onClick={() => logout()}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: "auto",
                  justifyContent: "center",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
}
