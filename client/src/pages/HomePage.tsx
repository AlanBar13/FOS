import { useEffect, useState, SyntheticEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from '../models/Table';
import { fetchTables } from '../services/table.service';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import AppLayout from '../components/Shared/AppLayout';
import AlertComponent from '../components/Shared/AlertComponent';

export default function HomePage(){
    const navigate = useNavigate();
    const [companyName, _] = useState<string>(import.meta.env.VITE_COMPANY_NAME);
    const [selection, setSelection] = useState<string>("");
    const [tables, setTables] = useState<Table[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const selectTable = (event: ChangeEvent<HTMLSelectElement>) => {
        const tableId = event.target.value;
        if (tableId === "0"){
            setError("Mesa seleccionada no disponible");
            setOpen(true);
            return;
        }

        setSelection(tableId);
        return navigate(`/menu?mesa=${tableId}`, { replace: true })
    }

    const handleClose = (_?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

    useEffect(() => {
        document.title = `${companyName} | FOS`;
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const tables = await fetchTables();
                setTables(tables);
            } catch (error) {
                setError((error as Error).message);
                setOpen(true);
            }
            setIsLoading(false);
        }

        fetchData()
    }, [])

    return (
        <AppLayout companyName={`${companyName} | FOS`} hideCart={true}>
            <Box sx={{height: '90vh', display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", alignContent: "center"}}>
                <Typography variant="h4" gutterBottom>
                    Bienvenido a {companyName}
                </Typography>
                <Typography variant="subtitle1">
                    Para iniciar elige mesa
                </Typography>
                {isLoading ? (<CircularProgress color='inherit' />) : (
                    <FormControl sx={{width: '80%'}}>
                        <NativeSelect 
                            value={selection}
                            inputProps={{
                                name: 'mesa',
                                id: 'uncontrolled-native',
                            }}
                            disabled={error !== null}
                            onChange={e => selectTable(e)}>
                                <option value={0}>Elige...</option>
                                {tables.map((table) => <option key={table.id} value={table.id}>{table.name}</option>)}
                        </NativeSelect>
                    </FormControl>
                )}
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} >
                    <AlertComponent severity='error'>Error: {error}</AlertComponent>
                </Snackbar>
            </Box>
        </AppLayout>
    )
}