import { useState, useEffect, SyntheticEvent } from 'react';
import { fetchMenuAll, deleteMenuItem } from '../../services/menu.service';
import { Menu } from '../../models/Menu';

import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Snackbar from '@mui/material/Snackbar';
import { AlertColor } from '@mui/material/Alert';
import DialogContentText from '@mui/material/DialogContentText';

import MenuDataComponent from './Menu/MenuDataComponent';
import AdminAppBarComponent from './Shared/AdminAppBarComponent';
import AddItemComponent from './Menu/AddItemComponent';
import AlertComponent from '../Shared/AlertComponent';
import DialogComponent from '../Shared/DialogComponent';

export default function MenuComponent(){
    const [menu, setMenu] = useState<Menu[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [alertSeverity, setAlertSeverity] = useState<AlertColor | undefined>("error");
    const [currentItem, setCurrentItem] = useState<Menu | null>(null);
    const [itemDelete, setItemDelete] = useState({id: 0, name: ""});

    useEffect(() => {
        const fetchMenuData = async () => {
            setIsLoading(true);
            try {
                const menu = await fetchMenuAll();
                setMenu(menu);
            } catch (error) {
                openFeedback('Error de red');
            }
            setIsLoading(false);
        }

        fetchMenuData();
    }, []);

    const addMenuItem = (newItem: Menu) => {
        setMenu([...menu, newItem])
    }

    const deleteItem = (id: number) => {
        const newList = menu.filter(item => item.id !== id);
        setMenu(newList)
    }

    const replaceList = (newList: Menu[]) => {
        setMenu(newList);
    }

    const updateItemInList = (newItem: Menu) => {
        const newList = menu.filter(item => item.id !== newItem.id);
        setMenu([...newList, newItem]);
    }

    const openFeedback = (message: string, severity?: AlertColor) => {
        if (severity) {
            setAlertSeverity(severity);
        }
        setError(message);
        setOpen(true);
    }

    const handleClose = (_?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
        setError("");
    };

    const listEditClicked = (id: number) => {
        const currentItem = menu.find(item => item.id === id);
        if (currentItem == null){
            setCurrentItem(null);
        }else{
            setCurrentItem(currentItem);
        }

        setOpenEditDialog(true);
    }

    const listDeleteClicked = (id: number) => {
        const currentItem = menu.find(item => item.id === id);
        setItemDelete({id, name: currentItem!.name});
        setOpenDeleteDialog(true);
    }

    const onEditConfirm = () => {
        setOpenEditDialog(false);
    }

    const onDeleteConfirm = async () => {
        try {
            await deleteMenuItem(itemDelete.id);
            deleteItem(itemDelete.id);
            openFeedback("Producto eliminado correctamente", "success");
        } catch (error) {
            openFeedback("Error al eliminar el producto")
        }
        setOpenDeleteDialog(false);
    }

    const onCancel = () => {
        setOpenDeleteDialog(false);
        setOpenEditDialog(false);
        setCurrentItem(null);
    }

    return(
        <>
            <AdminAppBarComponent title='Administracion de Menu' />
            <Accordion sx={{ marginBottom: '1rem'}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>Añadir nuevo producto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <AddItemComponent onAddItem={addMenuItem} onFeedback={openFeedback}/>
                </AccordionDetails>
            </Accordion>
            {isLoading ? <CircularProgress /> : <MenuDataComponent menu={menu} onMenuChange={replaceList} onEditClicked={listEditClicked} onDeleteClicked={listDeleteClicked} />}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} >
                <AlertComponent severity={alertSeverity}>{error}</AlertComponent>
            </Snackbar>
            <DialogComponent isOpen={openDeleteDialog} title='Borrar Producto' maxWidth="sm" onCancel={onCancel} onConfirm={onDeleteConfirm}>
                <DialogContentText>
                    Seguro que quieres borrar el producto: {itemDelete.name}?
                </DialogContentText>
            </DialogComponent>
            <DialogComponent isOpen={openEditDialog} title='Editar Producto' enableActions={false} onCancel={onCancel} onConfirm={onEditConfirm}>
                <AddItemComponent menu={currentItem} edit onAddItem={addMenuItem} onFeedback={openFeedback} onCancel={onCancel} onUpdateItem={updateItemInList}/>
            </DialogComponent>
        </>
    )
}