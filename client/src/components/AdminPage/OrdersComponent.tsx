import { useState, useEffect } from "react";
import { RawOrder } from "../../models/Order";
import { Table } from "../../models/Table";
import { useApi } from "../../hooks/ApiProvider";
import { useAlert } from "../../hooks/useAlert";

import AdminAppBarComponent from "./Shared/AdminAppBarComponent";
import OrdersDataComponent from "./Orders/OrdersDataComponent";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogActionsContent from "@mui/material/DialogContent";
import DialogActionsContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { AxiosError } from "axios";

export default function OrdersComponent() {
  const api = useApi();
  const [orders, setOrders] = useState<RawOrder[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [selection, setSelection] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    const getData = async () => {
      try {
        const orders = await api.order.fetchOrders();
        setOrders(orders);

        const tables = await api.table.fetchTables();
        setTables(tables);
      } catch (error) {
        showAlert(`Error del servidor`, "error");
      }
    };

    getData();
  }, []);

  const replaceList = (newList: RawOrder[]) => {
    setOrders(newList);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const selectTable = (event: SelectChangeEvent) => {
    const tableId = event.target.value;
    if (tableId === "0") {
      showAlert("Mesa seleccionada no disponible", "warning");
      return;
    }

    setSelection(tableId);
  };

  const onCreateOrder = async () => {
    if (selection === "") {
      showAlert("No hay mesa seleccionada", "warning");
      return;
    }

    try {
      const order = await api.table.createOrder(selection);
      setOrders([order, ...orders]);
      setOpen(false);
      setSelection("");
    } catch (error) {
      const err = error as AxiosError;
      if (err.response?.status === 400) {
        showAlert(`Mesa ya tiene orden activa`, "error");
      } else {
        showAlert(`Error con el servidor`, "error");
      }
    }
  };

  return (
    <>
      <AdminAppBarComponent title="Administracion Ordenes" />
      <Button
        sx={{ marginBottom: "1rem" }}
        fullWidth
        variant="contained"
        color="info"
        onClick={handleOpen}
      >
        Crear nueva orden
      </Button>
      <OrdersDataComponent orders={orders} onTableChange={replaceList} />
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Crear Orden</DialogTitle>
        <DialogActionsContent>
          <DialogActionsContentText>
            Selecciona la mesa
          </DialogActionsContentText>
          <FormControl fullWidth>
            <Select value={selection} onChange={selectTable}>
              {tables.map((table) => (
                <MenuItem key={table.id} value={table.id}>
                  {table.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogActionsContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={onCreateOrder}>Crear</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
