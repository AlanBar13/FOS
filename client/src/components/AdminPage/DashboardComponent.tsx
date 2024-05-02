import { useState, useEffect } from "react";
import { useSocketEvents, SocketEvent } from "../../hooks/useSocketEvents";
import { DashboardItems, NeedWaiterRequest } from "../../models/SocketModels";
import { SocketEvents } from "../../utils/socketClient";
import { useAlert } from "../../hooks/useAlert";
import { useApi } from "../../hooks/ApiProvider";

import AdminAppBarComponent from "./Shared/AdminAppBarComponent";
import DashboardItem from "./Dashboard/DashboardItem";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import WaiterNeededComponent from "./Dashboard/WaiterNeededComponent";

export default function DashboardComponent() {
  const api = useApi();
  const [pendingOrders, setPendingOrders] = useState<DashboardItems[]>([]);
  const [preparingOrders, setPreparingOrders] = useState<DashboardItems[]>([]);
  const [notifications, setNotifications] = useState<NeedWaiterRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { showAlert } = useAlert();

  const events: SocketEvent[] = [
    {
      name: SocketEvents.serverDashOrder,
      handler(newItem: DashboardItems) {
        setPendingOrders((prevPendingOrders) => {
          const newList = [newItem, ...prevPendingOrders];
          return newList;
        });
      },
    },
    {
      name: SocketEvents.serverUpdateDashOrder,
      handler(updatedOrder: DashboardItems) {
        setPreparingOrders((prevPreparingOrders) => {
          const newList = [updatedOrder, ...prevPreparingOrders];
          return newList;
        });
      },
    },
    {
      name: SocketEvents.needWaiter,
      handler(request: NeedWaiterRequest) {
        setNotifications((prev) => {
          const newList = [request, ...prev];
          return newList;
        });
      },
    },
  ];

  useSocketEvents(events);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const dashboardItems = await api.dashboard.getDashboardItems();

        setPendingOrders(dashboardItems.toPrepare);
        setPreparingOrders(dashboardItems.inKitchen);
      } catch (error) {
        showAlert(`Error: ${error}`, "error");
      }
      setLoading(false);
    };

    getData();
  }, []);

  const prepareClicked = (order: DashboardItems) => {
    const updatedList = pendingOrders.filter((o) => o.id !== order.id);
    setPendingOrders(updatedList);
  };

  const readyClicked = (order: DashboardItems) => {
    const updatedList = preparingOrders.filter((o) => o.id !== order.id);
    setPreparingOrders(updatedList);
  };

  const seenClicked = (id: string) => {
    const updatedList = notifications.filter((o) => o.id !== id);
    setNotifications(updatedList);
  };

  return (
    <>
      <AdminAppBarComponent title="Dashboard" />
      {loading ? (
        <CircularProgress />
      ) : (
        <div>
          <Typography variant="h4">
            Pendientes ({pendingOrders.length})
          </Typography>
          <ImageList cols={5}>
            {pendingOrders.map((order) => (
              <ImageListItem key={order.id}>
                <DashboardItem
                  order={order}
                  onPrepareClicked={prepareClicked}
                />
              </ImageListItem>
            ))}
          </ImageList>
          <Divider />
          <Typography variant="h4">
            En preparación ({preparingOrders.length})
          </Typography>
          <ImageList cols={5}>
            {preparingOrders.map((order) => (
              <ImageListItem key={order.id}>
                <DashboardItem
                  order={order}
                  onReadyClicked={readyClicked}
                  ready
                />
              </ImageListItem>
            ))}
          </ImageList>
          <Divider />
          <Typography variant="h4">
            Notificaciones ({notifications.length})
          </Typography>
          <ImageList cols={5}>
            {notifications.map((notification, i) => (
              <ImageListItem key={i}>
                <WaiterNeededComponent
                  request={notification}
                  seen={seenClicked}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </div>
      )}
    </>
  );
}
