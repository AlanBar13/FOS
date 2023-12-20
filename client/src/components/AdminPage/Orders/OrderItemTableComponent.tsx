import { OrderItem } from "../../../models/OrderItem";
import { formatPriceFixed } from "../../../utils/numbers";
import { ItemStatus } from "../../../utils/constants";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface OrderItemTableComponentProps {
    items?: OrderItem[]
}
export default function OrderItemTableComponent({ items = [] }: OrderItemTableComponentProps){
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 350}}>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Precio</TableCell>
                        <TableCell>IVA</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Editar</TableCell>
                        <TableCell>Borrar</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.Menu.name}</TableCell>
                            <TableCell>{ItemStatus.getSpanishName(item.status)}</TableCell>
                            <TableCell>{item.qty}</TableCell>
                            <TableCell>{formatPriceFixed(item.Menu.price)}</TableCell>
                            <TableCell>{formatPriceFixed(item.Menu.tax)}</TableCell>
                            <TableCell>{formatPriceFixed(item.qty * item.Menu.price)}</TableCell>
                            <TableCell>
                                <IconButton>
                                    <EditIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell>
                                <IconButton>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}