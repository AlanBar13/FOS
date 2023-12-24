import { useState } from 'react'
import { Menu } from '../../models/Menu';
import {Box} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

interface MenuItemComponentProps {
    item: Menu
    onAddClicked: (item: Menu, qty: number) => void
}

export default function MenuItemComponent({ item, onAddClicked }: MenuItemComponentProps){
    const [qty, setQty] = useState(1);

    const handleChange = (operation: string) => {
        if (operation === "-") {
            const value = qty - 1;
            if (value < 1){
                setQty(1);
                return;
            }

            setQty(value);
            return;
        } else {
            //TODO: allow user to set max.
            const value = qty + 1;
            if (value > 10){
                setQty(10);
                return;
            }

            setQty(value);
            return;
        }
    }

    return (
        <Card sx={{ display: 'flex', marginBottom: '1rem' }}>
            {item.img !== null ? (
                <CardMedia
                    component="img"
                    sx={{ width: 140 }}
                    image={item.img}
                    alt={item.name}
                />
            ) : ''}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography component="div" variant="h5">
                        {item.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {item.description}
                    </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '0.3rem'}}>
                    <IconButton size='large' onClick={() => handleChange("-")}>-</IconButton>
                    <TextField sx={{width: '2.9rem', alignItems: 'flex-end'}} inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', readOnly: true }} value={qty} />
                    <IconButton size='large' onClick={() => handleChange("+")}>+</IconButton>
                    <Button sx={{marginLeft: '0.3rem'}} onClick={() => onAddClicked(item, qty)}>Añadir</Button>
                </Box>
            </Box>
        </Card>
    )
}