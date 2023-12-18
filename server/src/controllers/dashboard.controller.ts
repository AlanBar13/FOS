import { Response } from "express";
import asyncHandler from "express-async-handler";
import { CustomRequest } from "../types";
import { activeDashboardItems } from "../services/order.service";

export const getActiveDashboardItems = asyncHandler(async (req: CustomRequest, res: Response) => {
    const authUser = req.user;
    if (!authUser){
        res.status(401);
        throw new Error(`Not authorized, not authenticated`);
    }
    
    const activeItems = await activeDashboardItems();

    res.json(activeItems);
});