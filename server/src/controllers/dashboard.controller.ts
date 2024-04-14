import { Response } from "express";
import asyncHandler from "express-async-handler";
import { CustomRequest } from "../types";
import kitchenQueue from "../services/kitchenQueue.service";

export const getActiveDashboardItems = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const toPrepare = kitchenQueue.values("toPrepare");
    const inKitchen = kitchenQueue.values("inKitchen");

    res.json({ toPrepare, inKitchen });
  },
);
