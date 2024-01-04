import { ChangeEvent, useState } from 'react';
import { KeyValues, OrderStatus } from '../../../utils/constants';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { UpdateOrder } from '../../../models/Order';

interface OrderPreviewFormProps {
    orderStatus?: string
    tips?: number
    UpdateOrder: (updatedValues: UpdateOrder) => void
}

export default function OrderPreviewFormComponent({ orderStatus = "", tips = 0, UpdateOrder }: OrderPreviewFormProps){
    const [statusArray, _] = useState<KeyValues[]>(OrderStatus.getStatusArray());
    const [statusValue, setStatusValue] = useState<string>(orderStatus);
    const [tip, setTip] = useState<number>(tips);

    const handleOnTipChange = (event : ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.target.value === ""){
            setTip(0);
        }else{
            setTip(parseFloat(event.target.value));
        }
    }

    const onUpdateOrder = () => {
        const orderUpdate: UpdateOrder = {
            status: statusValue,
            tips: tip
        }
        UpdateOrder(orderUpdate);
    }

    return (
        <Paper sx={{display: 'flex', padding: '1rem'}}>
            
            <FormControl sx={{width: '17rem', marginRight: '1rem'}}>
                <InputLabel>Orden Status</InputLabel>
                <Select label="Orden Status" value={statusValue} onChange={e => setStatusValue(e.target.value)}>
                    {statusArray.map(item => (
                        <MenuItem key={item.key} value={item.key}>{item.value}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{width: '17rem', marginRight: '1rem'}}>
                <InputLabel>Propina</InputLabel>
                <OutlinedInput label="Propina" value={tip} onChange={handleOnTipChange} />
            </FormControl>
            <Button variant='contained' color='success' sx={{color: 'white'}} onClick={onUpdateOrder}>Guardar Cambios</Button>
        </Paper>
    )
}