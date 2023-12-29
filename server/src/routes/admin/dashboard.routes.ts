import express from "express";
import { getActiveDashboardItems } from "../../controllers/dashboard.controller";
import { protectRoutes } from "../../middleware/authMiddleware";

const router = express.Router();

router.route("/").get(getActiveDashboardItems);

export default router;