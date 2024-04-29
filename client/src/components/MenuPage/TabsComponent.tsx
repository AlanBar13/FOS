import { useState, SyntheticEvent } from "react";
import lod from "lodash";
import { RawMenu } from "../../models/Order";
import { Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MenuItemComponent from "./MenuItemComponent";

interface TabsComponentProps {
    categories: string[]
    groupedItems: lod.Dictionary<RawMenu[]>;
    addToCart: (item: RawMenu, qty: number) => void;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
  
function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            {children}
          </Box>
        )}
      </div>
    );
}

function a11yProps(index: number) {
    return {
      id: `category-tab-${index}`,
      'aria-controls': `category-tabpanel-${index}`,
    };
  }

export default function TabsComponent({ categories, groupedItems, addToCart }: TabsComponentProps){
    const [value, setValue] = useState(0);

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setValue(newValue);
      };

    return(
        <>
            <Tabs sx={{ marginBottom: '0.5rem' }} value={value} onChange={handleChange} variant="fullWidth" aria-label="category-tabs">
                {categories.map((category, index) => <Tab label={category} {...a11yProps(index)} />)}
            </Tabs>
            {categories.map((category, index)=> (
                <CustomTabPanel value={value} index={index}>
                    {groupedItems[category].map(item => <MenuItemComponent key={item.id} item={item} onAddClicked={addToCart} />)}
                </CustomTabPanel>
            ))}
        </>
    )
}