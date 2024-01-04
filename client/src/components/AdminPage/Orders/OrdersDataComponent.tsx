import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RawOrder } from '../../../models/Order';
import { Order as TableOrder, createCompareFn } from '../../../utils/tableUtils';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Tooltip from '@mui/material/Tooltip';

import { formatPriceFixed } from '../../../utils/numbers';
import { formatStringDate } from '../../../utils/dates';
import { OrderStatus } from '../../../utils/constants';

interface OrdersDataComponentProps {
    orders: RawOrder[]
    onTableChange: (orders: RawOrder[]) => void
}

const properties = [
    {
        name: 'id',
        displayName: '#'
    },
    {
        name: 'tableId',
        displayName: 'mesa'
    },
    { 
        name: 'subtotal',
        displayName: 'sub-total',
        noSort: false
    },
    { 
        name: 'taxTotal',
        displayName: 'IVA',
        noSort: true
    },
    { 
        name: 'total',
        displayName: 'total'
    },
    { 
        name: 'status',
        displayName: 'status'
    },
    { 
        name: 'createdAt',
        displayName: 'creado'
    },
    { 
        name: 'updatedAt',
        displayName: 'actualizado'
    },
]

export default function OrdersDataComponent({ orders, onTableChange }: OrdersDataComponentProps) {
    const navigate = useNavigate();
    const [order, setOrder] = useState<TableOrder>('desc');
    const [orderBy, setOrderBy] = useState<keyof RawOrder>('id');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const visibleRows = useMemo(() => {
        return orders.sort(createCompareFn(orderBy, order)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [orders, page, rowsPerPage])

    const handleSort = (property: keyof RawOrder) => {
        const isAsc = orderBy === property && order =='asc';
        setOrder(isAsc ? 'desc': 'asc');
        setOrderBy(property);
        const newRows = orders.slice().sort(createCompareFn(property, order));
        onTableChange(newRows);
    }

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onSeeButtonClicked = (id?: number) => {
        if (id == null){
            return;
        }

        return navigate(`/admin/orders/${id}`);
    }

    const getOrderStatusColor = (status: string) => {
        switch(status){
            case OrderStatus.created:
                return {
                    name: "Creado",
                    color: "#FFFFFF"
                }
            case OrderStatus.ordering:
                return {
                    name: "Ordenando",
                    color: "#00FFFF"
                }
            case OrderStatus.deleted:
                return {
                    name: "Borrado",
                    color: "#FF0000"
                }
            case OrderStatus.paid:
                return {
                    name: "Pagado",
                    color: "#00FF00"
                }
            case OrderStatus.notPaid:
                return {
                    name: "No Pagado",
                    color: "#C0C0C0"
                }
            case OrderStatus.inKitchen:
                return {
                    name: "En cocina",
                    color: "#FF00FF"
                }
            case OrderStatus.served:
                return {
                    name: "Servido",
                    color: "#0000FF"
                }
            case OrderStatus.userClosed:
                return {
                    name: "Cerrado",
                    color: "#800000"
                }
            default:
                return {
                    name: "No status",
                    color: "#FFFFFF"
                }
        }
    }

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label='order table'>
                    <TableHead>
                        <TableRow>
                            {properties.map(property => (
                                <TableCell key={property.name} sortDirection={orderBy === property.name as keyof RawOrder ? order : false}>
                                    {property.noSort ? property.displayName.toLocaleUpperCase() : (
                                        <TableSortLabel 
                                            active={orderBy === property.name as keyof RawOrder}
                                            direction={orderBy === property.name as keyof RawOrder ? order : 'asc'}
                                            onClick={() => handleSort(property.name as keyof RawOrder)}>
                                            {property.displayName.toLocaleUpperCase()}
                                        </TableSortLabel>
                                    )}
                                </TableCell>
                            ))}
                            <TableCell>
                                Ver
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRows.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.tableId}</TableCell>
                                <TableCell>{formatPriceFixed(item.subtotal ?  item.subtotal : 0)}</TableCell>
                                <TableCell>{formatPriceFixed(item.taxTotal ? item.taxTotal : 0)}</TableCell>
                                <TableCell>{formatPriceFixed(item.total)}</TableCell>
                                <TableCell><Chip sx={{ background: getOrderStatusColor(item.status).color}} label={`${getOrderStatusColor(item.status).name}`} /></TableCell>
                                <TableCell>{formatStringDate(item.createdAt)}</TableCell>
                                <TableCell>{formatStringDate(item.updatedAt)}</TableCell>
                                <TableCell>
                                    <Tooltip title={`Ver orden ${item.id}`}>
                                        <IconButton onClick={() => onSeeButtonClicked(item.id)}>
                                            <RemoveRedEyeIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 15, 20]}
                component="div"
                count={orders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    )
}