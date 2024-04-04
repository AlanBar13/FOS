import express from "express";
import { getActiveDashboardItems } from "../../controllers/dashboard.controller";

const router = express.Router();

router.route("/").get(getActiveDashboardItems);

export default router;