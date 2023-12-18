import env from "../config/env";
import { Menu } from "../db/models";
import { MenuInput, MenuOutput } from "../db/models/Menu";
import { MenuQueryFilters } from "../types";

/**
* Create Menu Item on DB
*
* @param payload - Menu Item attributes
* @returns Menu Item from DB
*/
export const createMenuItem = async (payload: MenuInput): Promise<MenuOutput> => {
    const menuItem = await Menu.create(payload)
    return menuItem
}

/**
* Update Menu Item by ID
*
* @param id - Menu Item ID
* @param payload - Menu Item attributes
* @returns Menu Item from DB
*/
export const updateMenuItem = async (id: number, payload: Partial<MenuInput>): Promise<MenuOutput> => {
    const menuItem = await Menu.findByPk(id);

    if (!menuItem){
        throw new Error('not found')
    }

    const updatedMenuItem = await (menuItem as Menu).update(payload);
    return updatedMenuItem;
}

/**
* Get Menu Item by ID
*
* @param id - Menu Item ID
* @returns Menu Item from DB
*/
export const getMenuItemById = async (id: number): Promise<MenuOutput> => {
    const menuItem = await Menu.findByPk(id);

    if (!menuItem){
        throw new Error('not found')
    }

    return menuItem;
}

/**
* Delete Menu Item by ID
*
* @param id - Menu Item ID
* @returns True if deleted succesfully
*/
export const deleteMenuItemById = async (id: number): Promise<boolean> => {
   if(env.mode === "test"){
       const deleted = await Menu.destroy({ where: { id }, force: true })
       return !!deleted;
   }else{
        const deletedCount = await Menu.destroy({ where: {id} });
        return !!deletedCount
    }
}

/**
* Get All Menu Items on DB
*
* @param filters - filters for Query (disabled)
* @returns Menu Item from DB
*/
export const getAllMenuItems = async (filters?: MenuQueryFilters): Promise<MenuOutput[]> => {
    if (filters && filters.available){
        return Menu.findAll({ where: {available: true}, attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt']}});
    }
    return Menu.findAll();
}