import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";

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

interface AdminDrawerProps {
  drawerWidth: number;
}

const pages = [
  {
    title: "Dashboard",
    route: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "Menu",
    route: "/admin/menu",
    icon: <RestaurantIcon />,
  },
  {
    title: "Ordenes",
    route: "/admin/orders",
    icon: <BorderColorIcon />,
  },
  {
    title: "Mesas",
    route: "/admin/tables",
    icon: <TableRestaurantIcon />,
  },
];

export default function AdminDrawer({ drawerWidth = 240 }: AdminDrawerProps) {
  const navigate = useNavigate();
  const auth = useAuth();

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
        <Avatar>FOS</Avatar>
      </IconButton>
      <Divider />
      <List>
        {pages.map((page) => (
          <Tooltip key={page.title} title={page.title} placement="right">
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 2.5,
                }}
                onClick={() => navigateToRoute(page.route)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: "auto",
                    justifyContent: "center",
                  }}
                >
                  {page.icon}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
      <Divider />
      <List>
        <Tooltip title="Usuarios" placement="right">
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: "center",
                px: 2.5,
              }}
              onClick={() => navigateToRoute("/admin/users")}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: "auto",
                  justifyContent: "center",
                }}
              >
                <GroupIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </Tooltip>
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
