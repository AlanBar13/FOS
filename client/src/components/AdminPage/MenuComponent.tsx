import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/ApiProvider';
import { Menu } from '../../models/Menu';
import { useAlert } from '../../hooks/useAlert';

import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DialogContentText from '@mui/material/DialogContentText';

import MenuDataComponent from './Menu/MenuDataComponent';
import AdminAppBarComponent from './Shared/AdminAppBarComponent';
import AddItemComponent from './Menu/AddItemComponent';
import DialogComponent from '../Shared/DialogComponent';

export default function MenuComponent(){
    const {showAlert} = useAlert();
    const api = useApi();
    const [menu, setMenu] = useState<Menu[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<Menu | null>(null);
    const [itemDelete, setItemDelete] = useState({id: 0, name: ""});

    useEffect(() => {
        const fetchMenuData = async () => {
            setIsLoading(true);
            try {
                const menu = await api.menu.fetchMenuAll();
                setMenu(menu);
            } catch (error) {
                showAlert('Error con el servidor', 'error');
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
            await api.menu.deleteMenuItem(itemDelete.id);
            deleteItem(itemDelete.id);
            showAlert('Producto eliminado correctamente', 'success');
        } catch (error) {
            showAlert('Error al eliminar el producto', 'error');
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
                    <AddItemComponent onAddItem={addMenuItem} />
                </AccordionDetails>
            </Accordion>
            {isLoading ? <CircularProgress /> : <MenuDataComponent menu={menu} onMenuChange={replaceList} onEditClicked={listEditClicked} onDeleteClicked={listDeleteClicked} />}
            <DialogComponent isOpen={openDeleteDialog} title='Borrar Producto' maxWidth="sm" onCancel={onCancel} onConfirm={onDeleteConfirm}>
                <DialogContentText>
                    Seguro que quieres borrar el producto: {itemDelete.name}?
                </DialogContentText>
            </DialogComponent>
            <DialogComponent isOpen={openEditDialog} title='Editar Producto' enableActions={false} onCancel={onCancel} onConfirm={onEditConfirm}>
                <AddItemComponent menu={currentItem} edit onAddItem={addMenuItem}  onCancel={onCancel} onUpdateItem={updateItemInList}/>
            </DialogComponent>
        </>
    )
}