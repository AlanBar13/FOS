import express from "express";
import { getMenuItems, getItem } from "../../controllers/menu.controller";
import { verifyCache } from "../../middleware/cacheMiddleware";

const router = express.Router();

router.route("/").get(verifyCache, getMenuItems);
router.route("/:id").get(getItem);

export default router;
