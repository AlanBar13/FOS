import express from "express";
import { getOrder } from '../../controllers/orders.controller';
import { getItemsByOrder, deleteItemByOrderId, updateItemCommentsByOrderId } from '../../controllers/orderItem.controller';

const router = express.Router()

router.route("/:id").get(getOrder);
router.route("/:orderId/items").get(getItemsByOrder);
router.route("/:orderId/items/:itemId/delete").delete(deleteItemByOrderId);
router.route("/:orderId/items/:itemId/comments").patch(updateItemCommentsByOrderId);

export default router;