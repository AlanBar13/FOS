import express from "express";
import { getOrders, deleteOrder, changeOrderToReady, getOrderWithItems, updateOrder, changeOrderStatusAdmin } from '../../controllers/orders.controller';


const router = express.Router()

router.route("/").get(getOrders);
router.route("/:id").get(getOrderWithItems).patch(updateOrder).delete(deleteOrder);
router.route("/:id/status/change/:status").post(changeOrderStatusAdmin);
router.route("/:id/status/ready").post(changeOrderToReady);

export default router;