import { Table as TableModel } from '../../../models/Table';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import QrCodeIcon from '@mui/icons-material/QrCode';

import { formatDate } from '../../../utils/dates';

interface TableDataComponentProps {
    tables: TableModel[]
    onQRbuttonClick: (src: string) => void
}

export default function TableDataComponent({ tables, onQRbuttonClick }: TableDataComponentProps){
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} size='small' aria-label='tables table'>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Codigo QR</TableCell>
                        <TableCell>Creada</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tables.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                                <Tooltip title="Ver codigo QR">
                                    <IconButton onClick={() => onQRbuttonClick(item.qrcode!)}>
                                        <QrCodeIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{formatDate(item.createdAt)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}