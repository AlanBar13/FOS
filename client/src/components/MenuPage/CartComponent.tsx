import { useMemo } from 'react';
import _ from 'lodash';
import { Cart } from "../../models/Cart";
import { formatPriceFixed } from "../../utils/numbers";
import { useCurrentOrder } from '../../hooks/useCurrentOrder';

import {Box} from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';

interface CartComponentProps {
    cart: Cart[]
    isLoading: boolean
    deleteFromCart: (index: number) => void
    onOrder: () => void
}

export default function CartComponent({ cart, isLoading = false, deleteFromCart, onOrder }: CartComponentProps) {
    const currentOrder = useCurrentOrder();
    const cartTotal = useMemo(() => _.sumBy(cart, 'total'), [cart]);
    const orderTotal = useMemo(() => {
        let total = 0;
        currentOrder.orderedItems.forEach((item) => {
            if(item.Menu == null){
                return;
            }

            if(item.Menu.tax != null) {
                total += (item.Menu.price + item.Menu.tax) * item.qty;
            }else{
                total += item.Menu.price * item.qty;
            }
        });

        return total;
    }, [cart, currentOrder.orderedItems]);

    const getOrderColor = (status: string): string => {
        switch(status){
            case "ordered":
                return "red";
            case "inProgress":
                return "yellow";
            case "done":
                return "green";
            default:
                return "white"
        }
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between'}}>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <Box sx={{overflow: 'auto'}}>
                    <Typography variant='h6'>
                        Carrito
                    </Typography>
                    {cart.map((crt, index) => (
                        <Box key={index} sx={{display: 'flex', flexDirection: 'row'}}>
                            <IconButton onClick={() => deleteFromCart(index)}>X</IconButton>
                            <Typography sx={{paddingTop: '0.55rem'}} fontSize={13}>
                                {crt.qty}x - {crt.item.name} - {formatPriceFixed(crt.total)}
                            </Typography>
                        </Box>
                    ))}
                    <Typography sx={{paddingTop: '0.5rem'}} component="div">
                        <strong>SubTotal: {formatPriceFixed(cartTotal)}</strong>
                    </Typography>
                    <Button variant='contained' disabled={cart.length === 0} onClick={onOrder}>Ordenar</Button>
                </Box>
                <Divider orientation='vertical' flexItem />
                {currentOrder.orderedItems.length > 0 && (
                    <Box sx={{overflow: 'auto'}}>
                        <Divider />
                        <Typography variant='h6'>
                            Resumen Orden
                        </Typography>
                        {currentOrder.orderedItems.map((item, index) => (
                            <Box key={index} sx={{display: 'flex', flexDirection: 'row', backgroundColor: getOrderColor(item.status)}}>
                                <Typography sx={{paddingTop: '0.55rem'}} fontSize={13}>
                                    {item.qty}x - {item.Menu.name} - {formatPriceFixed(item.Menu.price * item.qty)}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
            <Box>
                <Divider />
                {isLoading && <LinearProgress />}
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Button disabled={currentOrder.orderedItems.length === 0}>Pagar</Button>
                    <Typography sx={{paddingTop: '0.5rem'}} component="div">
                        <strong>Total a pagar: {formatPriceFixed(orderTotal)}</strong>
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}