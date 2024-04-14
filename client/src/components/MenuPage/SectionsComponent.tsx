import lod from 'lodash';
import { RawMenu } from '../../models/Order';
import MenuItemComponent from './MenuItemComponent';

import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

interface SectionsComponentProps {
    category: string
    groupedItems: lod.Dictionary<RawMenu[]>
    addToCart: (item: RawMenu, qty: number) => void
}

export default function SectionsComponent({ category, groupedItems, addToCart }: SectionsComponentProps){
    return (
        <>
            <div style={{ marginBottom: '0.7rem'}}>
                <Typography variant='h5'>{category}</Typography>
                <Divider />
            </div>
            {groupedItems[category].map(item => <MenuItemComponent key={item.id} item={item} onAddClicked={addToCart} />)}
        </>
    )
}