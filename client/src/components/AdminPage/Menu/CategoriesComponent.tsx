import { Category } from '../../../models/Category';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CategoryItemComponent from './CategoryItemComponent';

interface CategoriesComponentProps {
    categories: Category[]
    saveCategory: (item: Category) => void
    deleteCategory: (id?: number) => void
}

export default function CategoriesComponent ({ categories, saveCategory, deleteCategory }: CategoriesComponentProps) {
    return (
        <div style={{ marginTop: '0.7rem' }}>
            <Typography variant='h5'>Categorias</Typography>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                {categories.map((category) => (
                    <Grid key={category.id} item xs={6}>
                        <CategoryItemComponent item={category} editAction={saveCategory} deleteAction={deleteCategory} />
                    </Grid>
                ))}
            </Grid>
        </div>
    )
}