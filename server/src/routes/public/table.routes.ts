import express from "express";
import { registerOrder, updateOrder, submitOrderToKitchen, isOrderActive, closeOrder } from '../../controllers/orders.controller';
import { registerOrderItem } from '../../controllers/orderItem.controller';
import { getTables } from '../../controllers/table.controller';
import { verifyCache } from "../../middleware/cacheMiddleware";

const router = express.Router()

router.route("/:tableId/order").get(isOrderActive).post(registerOrder);
router.route("/:tableId/order/:orderId/update").patch(updateOrder);
router.route("/:tableId/order/:orderId/add").post(registerOrderItem);
router.route("/:tableId/order/:orderId/submit").post(submitOrderToKitchen);
router.route("/:tableId/order/:orderId/close").post(closeOrder);
router.route("/").get(verifyCache, getTables);

export default router;