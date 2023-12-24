import { useEffect, useState } from 'react';
import { Table } from '../../models/Table';
import { fetchTables, createMultipleTables, deleteTables } from '../../services/table.service';

import {Box} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

import AdminAppBarComponent from "./Shared/AdminAppBarComponent";
import TableDataComponent from "./Tables/TableDataComponent";
import AddTableComponent from './Tables/AddTableComponent';
import DialogComponent from '../Shared/DialogComponent';

export default function TablesComponent(){
    const [tables, setTables] = useState<Table[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [qrSrc, setQrSrc] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchTables();
                setTables(res);
            } catch (error) {
                console.log(error)
            }
        }

        fetchData();
    }, []);


    const createTables = async(amount: number) => {
        setIsLoading(true);
        try {
            const res = await createMultipleTables(amount, `${window.location.origin}/menu`);
            const newTables = res.data as Table[];
            const newList = tables.concat(newTables);
            setTables(newList);
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false);
    }

    const deleteAllTables = async () => {
        setIsLoading(true);
        if (tables.length === 0){
            setIsLoading(false);
            return;
        }

        try {
            await deleteTables();
            setTables([]);
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false);
    }

    const showQrCode = (src: string) => {
        setQrSrc(src);
        setIsOpen(true);
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    return(
        <>
            <AdminAppBarComponent title="Administracion de mesas" />
            <AddTableComponent onCreateTables={createTables} onDeleteTables={deleteAllTables}/>
            {isLoading && <LinearProgress />}
            <TableDataComponent tables={tables} onQRbuttonClick={showQrCode} />
            <DialogComponent isOpen={isOpen} enableActions={false} maxWidth="sm" title='Codigo QR' onCancel={handleClose}>
                <Box sx={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                    <img width={300} height={300} src={qrSrc} />
                </Box>
            </DialogComponent>
        </>
    )
}