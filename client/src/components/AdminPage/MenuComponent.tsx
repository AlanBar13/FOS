import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/ApiProvider';
import { Menu } from '../../models/Menu';
import { Category } from '../../models/Category';
import { useAlert } from '../../hooks/useAlert';

import CircularProgress from '@mui/material/CircularProgress';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DialogContentText from '@mui/material/DialogContentText';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import MenuDataComponent from './Menu/MenuDataComponent';
import AdminAppBarComponent from './Shared/AdminAppBarComponent';
import AddItemComponent from './Menu/AddItemComponent';
import DialogComponent from '../Shared/DialogComponent';
import CategoriesComponent from './Menu/CategoriesComponent';

export default function MenuComponent(){
    const {showAlert} = useAlert();
    const api = useApi();
    const [menu, setMenu] = useState<Menu[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    const [currentItem, setCurrentItem] = useState<Menu | null>(null);
    const [itemDelete, setItemDelete] = useState({id: 0, name: ""});
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const fetchMenuData = async () => {
            setIsLoading(true);
            try {
                const categories = await api.category.fetchCategories();
                setCategories(categories);
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

    const addNewCategory = async () => {
        try {
            if(categoryName === ""){
                showAlert('La categoria no puede ser vacia', 'warning');
                return;
            }

            const category = await api.category.addCategory({ name: categoryName });
            setCategories([...categories, category])
            showAlert(`Categoria ${category.name} añadida correctamente`, 'success');
            setCategoryName("");
        } catch (error) {
            showAlert('Error al añadir la categoria', 'error');
        }
    }

    const saveCategory = async (item: Category) => {
        try {
            if(item.name === ""){
                showAlert('El numbre de la categoria no puede ser vacia', 'warning');
                return;
            }

            await api.category.updateCategory(item.id!, item);
            showAlert('Categoria editada correctamente', 'success');
        } catch (error) {
            showAlert('No se pudo editar la categoria', 'error');
        }
    }

    const deleteCategory = async (id?: number) => {
        try {
            if(id == null){
                showAlert('Id de categoria no puede ser vacia', 'warning');
                return;
            }

            await api.category.deleteCategory(id);
            const newCategories = categories.filter(cat => cat.id !== id);
            setCategories(newCategories);
            showAlert('Categoria eliminada correctamente', 'success');
        } catch (error) {
            showAlert('No se pudo editar la categoria', 'error');
        }
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
                    <Typography>Añadir nueva categoria</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup sx={{ marginTop: '0.5rem' }}>
                        <TextField fullWidth label="Nombre de Categoria" required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                        <br />
                        <Button fullWidth variant='outlined' onClick={addNewCategory}>Añadir</Button>
                    </FormGroup>
                    <CategoriesComponent categories={categories} saveCategory={saveCategory} deleteCategory={deleteCategory} />
                </AccordionDetails>
            </Accordion>
            <Accordion sx={{ marginBottom: '1rem'}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>Añadir nuevo producto</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {categories.length === 0 ? (
                        <Typography>Añada al menos una categoria para agregar </Typography>
                    ) : (
                        <AddItemComponent onAddItem={addMenuItem} categories={categories} />
                    )}
                </AccordionDetails>
            </Accordion>
            {isLoading ? <CircularProgress /> : <MenuDataComponent menu={menu} onMenuChange={replaceList} onEditClicked={listEditClicked} onDeleteClicked={listDeleteClicked} />}
            <DialogComponent isOpen={openDeleteDialog} title='Borrar Producto' maxWidth="sm" onCancel={onCancel} onConfirm={onDeleteConfirm}>
                <DialogContentText>
                    Seguro que quieres borrar el producto: {itemDelete.name}?
                </DialogContentText>
            </DialogComponent>
            <DialogComponent isOpen={openEditDialog} title='Editar Producto' enableActions={false} onCancel={onCancel} onConfirm={onEditConfirm}>
                <AddItemComponent menu={currentItem} categories={categories} edit onAddItem={addMenuItem}  onCancel={onCancel} onUpdateItem={updateItemInList}/>
            </DialogComponent>
        </>
    )
}