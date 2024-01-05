import express from "express";
import { getOrders, deleteOrder, changeOrderToReady, getOrderWithItems, updateOrder, changeOrderStatusAdmin } from '../../controllers/orders.controller';
import { deleteItemByOrderId } from "../../controllers/orderItem.controller";


const router = express.Router()

router.route("/").get(getOrders);
router.route("/:id").get(getOrderWithItems).patch(updateOrder).delete(deleteOrder);
router.route("/:id/status/change/:status").post(changeOrderStatusAdmin);
router.route("/:id/status/ready").post(changeOrderToReady);
router.route("/:orderId/items/:itemId").delete(deleteItemByOrderId);

export default router;