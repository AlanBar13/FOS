import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { User } from '../../../models/Users';
import { formatDate } from '../../../utils/dates';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface UserTableProps {
    users: User[]
}

export default function UserTableComponent({ users }: UserTableProps){
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} size='small' aria-label='tables table'>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Usuario</TableCell>
                        <TableCell>Rol</TableCell>
                        <TableCell>Creada</TableCell>
                        <TableCell>Reset Constraseña</TableCell>
                        <TableCell>Eliminar Usuario</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.username}</TableCell>
                            <TableCell>{item.role}</TableCell>
                            <TableCell>{formatDate(item.createdAt)}</TableCell>
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