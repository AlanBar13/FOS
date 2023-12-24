import { useState, ChangeEvent } from 'react';
import {Box} from "@mui/material";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface AddTableComponentProps {
    onCreateTables: (amount: number) => void
    onDeleteTables: () => void
}

export default function AddTableComponent({ onCreateTables, onDeleteTables }: AddTableComponentProps){
    const [number, setNumber] = useState(1);

    const onNumberChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.target.value === "" || parseInt(event.target.value) < 0){
            setNumber(0);
            return;
        }

        setNumber(parseInt(event.target.value));
    }

    return (
        <Box component='div' sx={{display: 'flex', flexDirection: "row", marginBottom: '1rem'}}>
            <TextField style={{marginRight: '0.5rem', background: 'white'}} type="number" label="Numero de mesas" value={number} onChange={e => onNumberChange(e)} />
            <Button style={{marginRight: '0.5rem'}} variant='contained' disabled={number === 0} onClick={() => onCreateTables(number)}>Crear {number} {number >= 2 ? "mesas" : "mesa"}</Button>
            <Button variant='contained' color='error' onClick={onDeleteTables}>Eliminar TODAS las mesas</Button>
        </Box>
    )
}