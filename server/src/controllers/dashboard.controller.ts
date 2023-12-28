import { Response } from "express";
import asyncHandler from "express-async-handler";
import { CustomRequest } from "../types";
import db from '../db/client';

export const getActiveDashboardItems = asyncHandler(async (req: CustomRequest, res: Response) => {
    const queue = await db.kitchenQueue.findMany({
        include: {
            Order: {
                include: {
                    OrderItems: true
                }
            }
        }
    });
    res.json(queue)
});