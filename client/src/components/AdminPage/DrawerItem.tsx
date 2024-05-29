import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Tooltip from "@mui/material/Tooltip";

interface DrawerItemProps {
    title: string
    route: string
    navigateTo: (route: string) => void
    icon: JSX.Element
}

export default function DrawerItem({title, route, icon, navigateTo}: DrawerItemProps) {
    return (
        <Tooltip title={title} placement="right">
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: "center",
                  px: 2.5,
                }}
                onClick={() => navigateTo(route)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: "auto",
                    justifyContent: "center",
                  }}
                >
                  {icon}
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
        </Tooltip>
    )
}