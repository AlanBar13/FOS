import { useMemo } from "react";
import _ from "lodash";
import { Cart } from "../../models/Cart";
import { formatPriceFixed } from "../../utils/numbers";
import { useCurrentOrder } from "../../hooks/useCurrentOrder";

import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";

interface CartComponentProps {
  cart: Cart[];
  isLoading: boolean;
  deleteFromCart: (index: number) => void;
  onOrder: () => void;
  onOpenModal: (total: number) => void;
}

export default function CartComponent({
  cart,
  isLoading = false,
  deleteFromCart,
  onOrder,
  onOpenModal,
}: CartComponentProps) {
  const currentOrder = useCurrentOrder();
  const cartTotal = useMemo(() => _.sumBy(cart, "total"), [cart]);
  const orderTotal = useMemo(() => {
    let total = 0;
    currentOrder.orderedItems.forEach((item) => {
      if (item.Menu == null) {
        return;
      }

      if (item.Menu.tax != null) {
        total += (item.Menu.price + item.Menu.tax) * item.qty;
      } else {
        total += item.Menu.price * item.qty;
      }
    });

    return total;
  }, [cart, currentOrder.orderedItems]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {cart.length > 0 ? (
          <>
            <Box sx={{ overflow: "auto" }}>
              <Typography variant="h6">Carrito</Typography>
              {cart.map((crt, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", flexDirection: "row" }}
                  onClick={() => deleteFromCart(index)}
                >
                  <Typography sx={{ paddingTop: "0.55rem" }} fontSize={13}>
                    {crt.qty}x - {crt.item.name} - {formatPriceFixed(crt.total)}
                  </Typography>
                </Box>
              ))}
              <Typography sx={{ paddingTop: "0.5rem" }} component="div">
                <strong>SubTotal: {formatPriceFixed(cartTotal)}</strong>
              </Typography>
              <Button
                variant="contained"
                disabled={cart.length === 0}
                onClick={onOrder}
              >
                Ordenar
              </Button>
            </Box>
            <Divider orientation="vertical" flexItem />
          </>
        ) : null}
        {currentOrder.orderedItems.length > 0 ? (
          <Box sx={{ overflow: "auto" }}>
            <Typography variant="h6">Resumen Orden</Typography>
            {currentOrder.orderedItems.map((item, index) => (
              <Box key={index} sx={{ display: "flex", flexDirection: "row" }}>
                <Typography sx={{ paddingTop: "0.55rem" }} fontSize={13}>
                  {item.qty}x - {item.Menu.name} -{" "}
                  {formatPriceFixed(item.Menu.price * item.qty)}{" "}
                  {item.status === "done" ? "- (Listo)" : null}
                  {item.status === "inProgress" ? "- (En Preparacion)" : null}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>
            No hay nada en tu cuenta, agrega algo para iniciar
          </Typography>
        )}
      </Box>
      <Box>
        <Divider />
        {isLoading && <LinearProgress />}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            disabled={currentOrder.orderedItems.length === 0}
            onClick={() => onOpenModal(orderTotal)}
          >
            Pagar
          </Button>
          <Typography sx={{ paddingTop: "0.5rem" }} component="div">
            <strong>Total a pagar: {formatPriceFixed(orderTotal)}</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
