import { useState } from 'react';
import { Category } from '../../../models/Category';

import { Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

interface CategoryItemComponentProps {
    item: Category
    editAction: (item: Category) => void
    deleteAction: (id?: number) => void
}

export default function CategoryItemComponent({item, editAction, deleteAction}: CategoryItemComponentProps){
    const [value, setValue] = useState(item.name);
    const [disabled, setDisabled] = useState(true);

    const saveChanges = () => {
        item.name = value;
        editAction(item);
        setDisabled(true);
    }

    return (
        <Paper component="form" sx={{display: "flex", justifyContent: "space-between"}}>
            <Box>
                <IconButton onClick={() => setDisabled(!disabled)}>
                    <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteAction(item.id)}>
                    <DeleteIcon />
                </IconButton>
                <InputBase value={value} onChange={e => setValue(e.target.value)} disabled={disabled} />
            </Box>
            <Box>
                {!disabled ? (
                    <IconButton onClick={saveChanges}>
                        <SaveIcon />
                    </IconButton>
                ) : null }
            </Box>
        </Paper>
    )
}