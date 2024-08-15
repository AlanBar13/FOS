import { useState, useEffect } from "react";
import lod, { debounce } from "lodash";
import { Cart } from "../models/Cart";
import { RawMenu, RawOrderItem } from "../models/Order";
import { FeedbackType } from "../models/SocketModels";
import { useApi } from "../hooks/ApiProvider";
import { useQuery } from "../hooks/useQuery";
import { socket, SocketEvents } from "../utils/socketClient";
import { useAlert } from "../hooks/useAlert";
import { useCurrentOrderDispatch } from "../hooks/useCurrentOrder";
import { SocketEvent, useSocketEvents } from "../hooks/useSocketEvents";
import { formatPriceFixed } from "../utils/numbers";

import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/material";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";

import AppLayout from "../components/Shared/AppLayout";
import CartComponent from "../components/MenuPage/CartComponent";
import DialogComponent from "../components/Shared/DialogComponent";
import TabsComponent from "../components/MenuPage/TabsComponent";
import PaymentComponent from "../components/MenuPage/PaymentComponent";
import { AxiosError } from "axios";

const drawerBleeding = 56;

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "grey",
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? "grey" : "white",
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default function MenuPage() {
  const { showAlert } = useAlert();
  const api = useApi();
  const dispatch = useCurrentOrderDispatch();
  const query = useQuery();
  const [companyName, _] = useState<string>(import.meta.env.VITE_COMPANY_NAME);
  const [openCart, setOpenCart] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableId] = useState<string | null>(query.get("mesa"));
  const [orderId, setOrderId] = useState<number | null>(null);
  const [cart, setCart] = useState<Cart[]>([]);
  const [cartIsLoading, setCartIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [grouped, setGrouped] = useState<lod.Dictionary<RawMenu[]> | null>();
  const [total, setTotal] = useState<number>(0);
  const [method, setMethod] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const events: SocketEvent[] = [
    {
      name: SocketEvents.sendClientFeedback,
      handler(items: RawOrderItem[], type: FeedbackType, orderId: number) {
        if (orderId > 0) {
          setOrderId(orderId);
        }
        switch (type) {
          case "itemAdded":
            dispatch({
              type: "addItems",
              payload: {
                orderItems: items,
              },
            });
            break;
          case "itemReady":
            dispatch({
              type: "updateItems",
              payload: {
                orderItems: items,
              },
            });
            showAlert("Tu pedido esta listo, en un momento se llevara a tu mesa", "info");
            break;
          default:
            dispatch({
              type: "updateItems",
              payload: {
                orderItems: items,
              },
            });
            break;
        }
      },
    },
    {
      name: SocketEvents.roomConnected,
      handler(msg: string) {
        console.log(`[Socket] ${msg}`);
      },
    },
  ];

  useSocketEvents(events);

  useEffect(() => {
    document.title = `${companyName} | Menu`;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (tableId !== null) {
          const room = `table:${tableId}`;
          socket.emit("join", room);
          const order = await api.table.getActiveOrder(tableId);
          setOrderId(order.id);
          if (order.OrderItems) {
            dispatch({
              type: "replaceItems",
              payload: {
                orderItems: order.OrderItems,
              },
            });
          }
        }

        const menu = await api.menu.fetchMenu();
        const categoriesRaw = await api.category.fetchCategories();
        const grouped = lod.groupBy(menu, "Category.name");
        const categories = lod.map(categoriesRaw, (el) => {
          return el.name;
        });
        setCategories(categories);
        setGrouped(grouped);
      } catch (error) {
        showAlert(`Error ${(error as Error).message}`, "error");
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const addItemToCart = async (orderIdToUpdate: number) => {
    if (tableId == null) {
      showAlert("No se puede agregar al carrito falta mesa", "error");
      return;
    }

    let newItemsOrdered: RawOrderItem[] = [];
    await Promise.all(
      cart.map(async (crt) => {
        try {
          const newOrderItem = await api.table.addOrderItem(
            tableId,
            orderIdToUpdate,
            {
              menuId: crt.item.id,
              qty: crt.qty,
              //TODO: add comments
            },
          );
          newItemsOrdered.push(newOrderItem);
        } catch (error) {
          console.log(error);
        }
      }),
    );

    socket.emit(
      SocketEvents.clientSendOrder,
      orderIdToUpdate,
      Number(tableId),
      newItemsOrdered,
    );
  };

  const addToCart = (item: RawMenu, qty: number) => {
    setCart([...cart, { qty, item, total: qty * item.price }]);
    setOpenCart(true);
  };

  const deleteFromCart = (itemIndex: number) => {
    const newCart = cart.filter((_, index) => index !== itemIndex);
    setCart(newCart);
  };

  const orderItems = async () => {
    if (tableId === null) {
      console.log("no table id");
      return;
    }
    setCartIsLoading(true);
    //If there is no order create an order
    if (orderId == null) {
      console.log("no active order");
      try {
        const orderCreated = await api.table.createOrder(tableId);
        setOrderId(orderCreated.id);
        await addItemToCart(orderCreated.id);
      } catch (error) {
        const err = error as AxiosError;
        console.log(err);
        if (err.response?.status === 403){
          showAlert(`Ordenes desactivadas, contacta a un mesero`, "error");
        }else {
          showAlert(`Error ${error}`, "error");
        }
      }
    } else {
      await addItemToCart(orderId);
    }

    setCart([]);
    setCartIsLoading(false);
  };

  const order = async () => {
    await orderItems();
    setOpenModal(false);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenCart(newOpen);
  };

  const onOpenModal = () => {
    setOpenModal(true);
  };

  const onOpenPaymentModal = (total: number) => {
    setTotal(total);
    setOpenPaymentModal(true);
  };

  const completePayment = async () => {
    socket.emit("sendPaymentRequest", orderId, Number(tableId), method, email);
    setOpenPaymentModal(false);
    showAlert(
      "Gracias por tu preferencia, esta orden sera cerrada en 5 segundos",
      "info",
    );
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(5000);
    window.location.reload();
  };

  return (
    <AppLayout
      companyName={`${companyName} | Menu`}
      toggleCart={() => setOpenCart(true)}
    >
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
      {isLoading && <LinearProgress />}
      <Box
        sx={{
          marginBottom: "4rem",
        }}
      >
        <TabsComponent
          categories={categories}
          groupedItems={grouped!}
          addToCart={addToCart}
        />
      </Box>
      <SwipeableDrawer
        anchor="bottom"
        open={openCart}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{ keepMounted: true }}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
            background: "#ffff",
            boxShadow: "0px -4px 3px rgba(50, 50, 50, 0.10)",
          }}
        >
          <Puller />
          <Typography
            component="div"
            sx={{ p: 2, color: "text.secondary.contrastText" }}
          >
            <strong>
              {orderId != null && `Orden #${orderId} |`}{" "}
              {tableId !== null
                ? `Mesa ${tableId}`
                : `No hay mesa seleccionada`}{" "}
              | Carrito ({cart.length})
            </strong>
          </Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 1,
            height: "100%",
            overflow: "auto",
          }}
        >
          <CartComponent
            cart={cart}
            isLoading={cartIsLoading}
            deleteFromCart={deleteFromCart}
            onOrder={onOpenModal}
            onOpenModal={onOpenPaymentModal}
          />
        </StyledBox>
      </SwipeableDrawer>
      <DialogComponent
        title="Deseas continuar?"
        isOpen={openModal}
        onCancel={() => setOpenModal(false)}
        onConfirm={debounce(order, 300)}
      >
        <Typography>
          Una vez agregados los productos no se podra hacer cambios a la orden,
          si tienes duda pregunta al mesero.
        </Typography>
      </DialogComponent>
      <DialogComponent
        title={`Monto a pagar ${formatPriceFixed(total)}`}
        isOpen={openPaymentModal}
        onCancel={() => setOpenPaymentModal(false)}
        onConfirm={completePayment}
      >
        <PaymentComponent
          method={method}
          setMethod={setMethod}
          email={email}
          setEmail={setEmail}
        />
      </DialogComponent>
    </AppLayout>
  );
}
