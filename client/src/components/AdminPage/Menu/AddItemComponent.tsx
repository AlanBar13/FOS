import { useState, useMemo, ChangeEvent } from 'react'

import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';
import { AlertColor } from '@mui/material/Alert';
import {Box} from '@mui/material';

import { foodCategories } from '../../../utils/constants';
import { Menu } from '../../../models/Menu';
import { uploadImage, addMenuItem, updateMenuItem } from '../../../services/menu.service';

interface AddItemComponentProps {
    menu?: Menu | null
    edit?: boolean
    onAddItem: (newItem: Menu) => void
    onFeedback: (message: string, alertSeverity?: AlertColor) => void
    onUpdateItem?: (updatedItem: Menu) => void
    onCancel?: () => void
}

const options = foodCategories.map(category => {
    return {
        label: category,
        value: category
    }
});

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const defaultItem : Menu = {
    name: "",
    description: "",
    available: false,
    category: "",
    price: 0,
    tax: 0,
    img: undefined
}

export default function AddItemComponent({ menu = null, edit, onAddItem, onFeedback, onUpdateItem, onCancel }: AddItemComponentProps){
    const [item, setItem] = useState<Menu>(menu !== null ? menu : defaultItem);
    const [imageLoading, setImageLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadText, setUploadText] = useState<string>("");
    const disabled = useMemo(() => (!(item.name !== "" && item.category !== "" && item.price !== 0 && !imageLoading)), [item, imageLoading]);

    const handleNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setItem({...item, name: event.target.value });
    }

    const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setItem({...item, description: event.target.value });
    }

    const handleAvailableChange = (event: ChangeEvent<HTMLInputElement>) => {
        setItem({...item, available: Boolean(event.target.checked) });
    }
    
    const handleCategoryChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setItem({...item, category: event.target.value });
    }

    const handlePriceChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.target.value === "") {
            setItem({...item, price: 0 });
        }else{
            setItem({...item, price: parseFloat(event.target.value) });
        } 
    }

    const handleTaxChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.target.value === "") {
            setItem({...item, tax: 0 });
        }else{
            setItem({...item, tax: parseFloat(event.target.value) });
        } 
    }

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        setImageLoading(true);
        if (event.target.files === null){
            return;
        }

        try {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('img', file);
            const response = await uploadImage(formData);
            setItem({...item, img: response.data.url});
            setUploadText(`Imagen cargada correctamente: ${file.name}`);
        } catch (error) {
            console.log(error);
            onFeedback("Error al subir imagen");
            setUploadText(`Error cargando imagen`);
        }
        setImageLoading(false);
    }

    const submitForm = async () => {
        setIsLoading(true);
        if (edit && menu !== null) {
            try {
                const updatedItem = await updateMenuItem(item, menu.id!);
                onUpdateItem!(updatedItem);
                setItem(defaultItem);
                setUploadText("");
                onFeedback(`Se acrualizo ${updatedItem.name} correctamente`, "success");
            } catch (error) {
                console.log(error);
                onFeedback("Error al actualizar el producto");
            }
            onCancel!()
        }else {
            try {
                const newItem = await addMenuItem(item);
                onAddItem(newItem);
                setItem(defaultItem);
                setUploadText("");
                onFeedback(`Se agrego ${newItem.name} correctamente`, "success");
            } catch (error) {
                console.log(error);
                onFeedback("Error al añadir el producto");
            }
        }
        setIsLoading(false);
    }

    return (
        <FormGroup sx={{ marginTop: '0.5rem' }}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField fullWidth label="Nombre" required value={item.name} onChange={handleNameChange} />
                </Grid>
                <Grid item  xs={6}>
                    <TextField fullWidth label="Categoria" required select value={item.category} onChange={handleCategoryChange} >
                        {options.map(option => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={5}>
                    <TextField fullWidth label="Precio" type="number" InputProps={{ startAdornment: (<InputAdornment position='start'>$</InputAdornment>)}} required value={item.price.toString()} onChange={handlePriceChange} />
                </Grid>
                <Grid item xs={5}>
                    <TextField fullWidth label="IVA" type="number" InputProps={{ startAdornment: (<InputAdornment position='start'>$</InputAdornment>)}} value={item.tax?.toString()} onChange={handleTaxChange} />
                </Grid>
                <Grid item xs={2}>
                    <FormControlLabel control={<Switch checked={item.available} onChange={handleAvailableChange} />} label="Disponible" />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Descripcion" multiline rows={3} value={item.description} onChange={handleDescriptionChange} />
                </Grid>
                <Grid item xs={12}>
                    <Button component="label" variant='contained' startIcon={<CloudUploadIcon />}>
                        Subir imagen
                        <VisuallyHiddenInput type='file' onChange={handleImageChange} />
                    </Button>
                    <Typography>
                        {imageLoading ? " Cargando Imagen" : ` ${uploadText}`}
                    </Typography>
                </Grid>
                {menu === null ? (
                    <Grid item xs={12}>
                        <Box sx={{position: 'relative' }}>
                                <Button fullWidth variant='contained' color='success' sx={{color: 'white'}} onClick={submitForm} disabled={disabled}>
                                    Guardar
                                </Button>
                                {isLoading && <CircularProgress size={24} sx={{ color: 'black', position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }}/>}
                            </Box>
                    </Grid>
                ) : (
                    <>
                        <Grid item xs={6}>
                            <Button fullWidth variant='contained' color='error' sx={{color: 'white'}} onClick={onCancel} disabled={disabled}>
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item xs={6} alignItems="center">
                            <Box sx={{position: 'relative' }}>
                                <Button fullWidth variant='contained' color='success' sx={{color: 'white'}} onClick={submitForm} disabled={disabled}>
                                    Guardar
                                </Button>
                                {isLoading && <CircularProgress size={24} sx={{ color: 'black', position: 'absolute', top: '50%', left: '50%', marginTop: '-12px', marginLeft: '-12px' }}/>}
                            </Box>
                        </Grid>
                    </>
                )}
            </Grid>
        </FormGroup>
    )
}