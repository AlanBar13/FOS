import { useState, useEffect } from 'react';
import { Cart } from '../models/Cart';
import { RawMenu, RawOrderItem } from '../models/Order';
import { FeedbackType } from '../models/SocketModels';
import { fetchMenu } from '../services/menu.service';
import { createOrder, addOrderItem, getActiveOrder } from '../services/table.service';
import { useQuery } from '../hooks/useQuery';
import { socket, SocketEvents } from '../utils/socketClient';
import { useAlert } from '../hooks/useAlert';
import { useCurrentOrderDispatch } from '../hooks/useCurrentOrder';

import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import {Box} from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';

import MenuItemComponent from '../components/MenuPage/MenuItemComponent';
import AppLayout from '../components/Shared/AppLayout';
import CartComponent from '../components/MenuPage/CartComponent';
import { SocketEvent, useSocketEvents } from '../hooks/useSocketEvents';

const drawerBleeding = 56;

const StyledBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'light' ? '#fff' : 'grey',
}));

const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? 'grey' : 'white',
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: 'calc(50% - 15px)',
}));

export default function MenuPage(){
    const { showAlert } = useAlert();
    const dispatch = useCurrentOrderDispatch();
    const query = useQuery();
    const [companyName, _] = useState<string>(import.meta.env.VITE_COMPANY_NAME);
    const [menu, setMenu] = useState<RawMenu[]>([]);
    const [openCart, setOpenCart] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tableId] = useState<string | null>(query.get("mesa"));
    const [orderId, setOrderId] = useState<number | null>(null);
    const [cart, setCart] = useState<Cart[]>([]);
    const [cartIsLoading, setCartIsLoading] = useState<boolean>(false);

    const events: SocketEvent[] = [
        {
            name: SocketEvents.sendClientFeedback,
            handler(items: RawOrderItem[], type: FeedbackType) {
                if (type === "itemAdded"){
                    dispatch({
                        type: "addItems",
                        payload: {
                            orderItems: items
                        }
                    })
                }
            }
        },
        {
            name: SocketEvents.roomConnected,
            handler(msg: string) {
                console.log(`[Socket] ${msg}`)
            }
        }
    ];

    useSocketEvents(events);

    useEffect(() => {
        document.title = `${companyName} | Menu`;
        const fetchData = async () => {
            setIsLoading(true);
            try {
                if(tableId !== null){
                    const room = `table:${tableId}`;
                    socket.emit("join", room)
                    const order = await getActiveOrder(tableId);
                    setOrderId(order.id);
                    if(order.OrderItems){
                        dispatch({
                            type: "addItems",
                            payload: {
                                orderItems: order.OrderItems
                            }
                        });
                    }
                }

                const menu = await fetchMenu();
                setMenu(menu);
            } catch (error) {
                showAlert(`Error ${(error as Error).message}`, 'error')
            }
            setIsLoading(false);
        }

        fetchData();
    }, []);

    const addItemToCart = async (orderIdToUpdate: number) => {
        if (tableId == null){
            showAlert("No se puede agregar al carrito falta mesa", "error");
            return;
        }

        let newItemsOrdered: RawOrderItem[] = [];
        await Promise.all(
            cart.map(async (crt) => {
                try {
                    const newOrderItem = await addOrderItem(tableId, orderIdToUpdate, {
                        menuId: crt.item.id,
                        qty: crt.qty,
                        //TODO: add comments
                    });
                    newItemsOrdered.push(newOrderItem);
                } catch (error) {
                    console.log(error)
                }
            })
        );

        socket.emit(SocketEvents.clientSendOrder, orderIdToUpdate, Number(tableId), newItemsOrdered)
    }

    const addToCart = (item: RawMenu, qty: number) => {
        setCart([...cart, { qty, item, total: qty * item.price }]);
        setOpenCart(true);
    }

    const deleteFromCart = (itemIndex: number) => {
        const newCart = cart.filter((_, index) => index !== itemIndex);
        setCart(newCart);
    }

    const order = async () => {
        if (tableId === null) {
            console.log('no table id')
            return;
        }
        setCartIsLoading(true);
        //If there is no order create an order
        if (orderId == null){
            console.log('no active order')
            try {
                const orderCreated = await createOrder(tableId);
                setOrderId(orderCreated.id);
                await addItemToCart(orderCreated.id);
            } catch (error) {
                showAlert(`Error ${error}`, "error");
            }
        }else{
            await addItemToCart(orderId);
        }

        setCart([]);
        setCartIsLoading(false);
    }

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpenCart(newOpen);
    };

    return (
        <AppLayout companyName={`${companyName} | Menu`}>
            <Global
                styles={{
                '.MuiDrawer-root > .MuiPaper-root': {
                    height: `calc(50% - ${drawerBleeding}px)`,
                    overflow: 'visible',
                },
                }}
            />
            {isLoading && <LinearProgress />}
            <Box sx={{marginTop: '0.5rem', marginLeft: '0.5rem', marginRight: '0.5rem', marginBottom: '4rem' }}>
                {menu.map((item) => <MenuItemComponent key={item.id} item={item} onAddClicked={addToCart} />)}
            </Box>
            <SwipeableDrawer 
                anchor='bottom' 
                open={openCart} 
                onClose={toggleDrawer(false)} 
                onOpen={toggleDrawer(true)} 
                swipeAreaWidth={drawerBleeding} 
                disableSwipeToOpen={false} 
                ModalProps={{keepMounted: true}}
            >
                <StyledBox
                    sx={{
                        position: 'absolute',
                        top: -drawerBleeding,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        visibility: 'visible',
                        right: 0,
                        left: 0,
                        background: '#FFC107'
                    }}
                >
                    <Puller />
                    <Typography component="div" sx={{ p: 2, color: 'text.secondary.contrastText' }}>
                        <strong>
                            {orderId != null && `Orden #${orderId} |`} {tableId !== null ? `Mesa ${tableId}` : `No hay mesa seleccionada`} | Carrito ({cart.length})
                        </strong>
                    </Typography>
                </StyledBox>
                <StyledBox
                    sx={{
                        px: 2,
                        pb: 1,
                        height: '100%',
                        overflow: 'auto',
                    }}
                    >
                    <CartComponent cart={cart} isLoading={cartIsLoading} deleteFromCart={deleteFromCart} onOrder={order} />
                </StyledBox>
            </SwipeableDrawer>
        </AppLayout>
    )
}