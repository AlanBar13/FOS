import { useState, useEffect } from 'react';
import { useSocketEvents, SocketEvent } from '../../hooks/useSocketEvents';
import { DashboardItems } from '../../models/SocketModels';
import { PersistenceKeys } from '../../utils/constants';
import { storageService } from '../../utils/storage';
import { SocketEvents } from '../../utils/socketClient';

import AdminAppBarComponent from './Shared/AdminAppBarComponent';
import DashboardItem from './Dashboard/DashboardItem';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export default function DashboardComponent(){
    const [pendingOrders, setPendingOrders] = useState<DashboardItems[]>([]);
    const [preparingOrders, setPreparingOrders] = useState<DashboardItems[]>([]);

    const events: SocketEvent[] = [
        {
            name: SocketEvents.serverDashOrder,
            handler(newItem: DashboardItems) {
                setPendingOrders(prevPendingOrders => {
                    const newList = [newItem, ...prevPendingOrders];
                    storageService.dashboardAddList(PersistenceKeys.DBPENDING, newList);
                    return newList;
                });
            }
        },
        {
            name: SocketEvents.serverUpdateDashOrder,
            handler(updatedOrder: DashboardItems){
                setPreparingOrders(prevPreparingOrders => {
                    const newList = [updatedOrder, ...prevPreparingOrders];
                    storageService.dashboardAddList(PersistenceKeys.DBPREPARING, newList);
                    return newList;
                })
            }
        }
    ];

    useSocketEvents(events);

    useEffect(() => {
        const pendSavedList = storageService.getDashboardList(PersistenceKeys.DBPENDING);
        if (pendSavedList !== null && pendSavedList.length > 0){
            setPendingOrders(pendSavedList);
        }

        const prepSavedList = storageService.getDashboardList(PersistenceKeys.DBPREPARING);
        if (prepSavedList !== null && prepSavedList.length > 0){
            setPreparingOrders(prepSavedList);
        }
    }, []);

    const prepareClicked = (order: DashboardItems) => {
        const updatedList = pendingOrders.filter(o => o.id !== order.id);
        storageService.dashboardAddList(PersistenceKeys.DBPENDING, updatedList)
        setPendingOrders(updatedList);
    }

    const readyClicked = (order: DashboardItems) => {
        const updatedList = preparingOrders.filter(o => o.id !== order.id);
        storageService.dashboardAddList(PersistenceKeys.DBPREPARING, updatedList)
        setPreparingOrders(updatedList);
    }
    
    return (
        <>
            <AdminAppBarComponent title='Dashboard' />                                                                            
            <Typography variant='h4'>Pendientes ({pendingOrders.length})</Typography>
            <ImageList cols={5}>
                {pendingOrders.map(order => (
                    <ImageListItem key={order.id}>
                        <DashboardItem order={order} onPrepareClicked={prepareClicked} />
                    </ImageListItem>
                ))}
            </ImageList>
            <Divider />
            <Typography variant='h4'>En preparación ({preparingOrders.length})</Typography>
            <ImageList cols={5}>
                {preparingOrders.map(order => (
                    <ImageListItem key={order.id}>
                        <DashboardItem order={order} onReadyClicked={readyClicked} ready/>
                    </ImageListItem>
                ))}
            </ImageList>
        </>
    )
}