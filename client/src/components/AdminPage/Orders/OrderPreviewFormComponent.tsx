import { ChangeEvent, useState } from 'react';
import { KeyValues, OrderStatus } from '../../../utils/constants';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

interface OrderPreviewFormProps {
    orderStatus?: string
}

export default function OrderPreviewFormComponent({ orderStatus = "" }: OrderPreviewFormProps){
    const [statusArray, _] = useState<KeyValues[]>(OrderStatus.getStatusArray());
    const [statusValue, setStatusValue] = useState<string>(orderStatus);
    const [tip, setTip] = useState<number>(0);

    const handleOnTipChange = (event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.target.value === ""){
            setTip(0);
        }else{
            setTip(parseFloat(event.target.value));
        }
    }

    return (
        <Paper sx={{display: 'flex', padding: '1rem'}}>
            
            <FormControl sx={{width: '17rem'}}>
                <InputLabel>Orden Status</InputLabel>
                <Select label="Orden Status" value={statusValue} onChange={e => setStatusValue(e.target.value)}>
                    {statusArray.map(item => (
                        <MenuItem value={item.key}>{item.value}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{width: '17rem'}}>
                <InputLabel>Añadir Propina</InputLabel>
                <OutlinedInput label="Añadir Propina" value={tip} onChange={handleOnTipChange} />
            </FormControl>
            <Button variant='contained' color='success' sx={{color: 'white'}}>Guardar Cambios</Button>
        </Paper>
    )
}