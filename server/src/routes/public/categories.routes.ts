import express from "express";
import { getAllCategories } from "../../controllers/categories.controllers";

const router = express.Router();

router.route("/").get(getAllCategories);

export default router;
