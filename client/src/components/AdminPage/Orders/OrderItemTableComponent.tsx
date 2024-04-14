import { RawOrderItem, getOrderItemStatusString } from "../../../models/Order";
import { formatPriceFixed } from "../../../utils/numbers";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

interface OrderItemTableComponentProps {
  items?: RawOrderItem[];
  onDelete: (id: number) => void;
}
export default function OrderItemTableComponent({
  items = [],
  onDelete,
}: OrderItemTableComponentProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 350 }}>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>IVA</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Borrar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.Menu.name}</TableCell>
              <TableCell>{getOrderItemStatusString(item.status)}</TableCell>
              <TableCell>{item.qty}</TableCell>
              <TableCell>{formatPriceFixed(item.Menu.price)}</TableCell>
              <TableCell>{formatPriceFixed(item.Menu.tax ?? 0)}</TableCell>
              <TableCell>
                {item.Menu.tax !== null
                  ? formatPriceFixed(
                      (item.Menu.price + item.Menu.tax) * item.qty,
                    )
                  : formatPriceFixed(item.Menu.price * item.qty)}
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onDelete(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
