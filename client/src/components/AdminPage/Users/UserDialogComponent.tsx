import { ChangeEvent, useState } from "react";
import { UserRoles } from "../../../utils/constants";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogActionsContent from '@mui/material/DialogContent';
import DialogActionsContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';

interface UserDialogComponentProps {
    open: boolean
    closeModal: () => void
    createUser: (username: string, password: string, role: string) => void
}

export default function UserDialogComponent({open, closeModal, createUser}: UserDialogComponentProps){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("viewer");

    const handleRoleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRole(event.target.value)
    }

    return (
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogActionsContent>
                <DialogActionsContentText>
                    Llena la siguiente informacion
                </DialogActionsContentText>
                <br />
                <FormGroup>
                    <TextField fullWidth label="Usuario" required value={username} onChange={(e) => setUsername(e.target.value)} />
                    <br />
                    <TextField fullWidth label="Contraseña" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <br />
                    <FormLabel id="demo-row-radio-buttons-group-label">Rol</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        value={role}
                        onChange={handleRoleChange}
                        name="row-radio-buttons-group">
                        {UserRoles.getRoles().map((role, index) => (
                            <FormControlLabel key={index} value={role} control={<Radio />} label={UserRoles.getSpanishName(role)} />
                        ))}
                    </RadioGroup>
                </FormGroup>
            </DialogActionsContent>
            <DialogActions>
                <Button onClick={closeModal}>Cancelar</Button>
                <Button onClick={() => createUser(username, password, role)}>Crear</Button>
            </DialogActions>
        </Dialog>
    );
}