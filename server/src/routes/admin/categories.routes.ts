import express from "express";
import { createNewCategory, deleteCategory, getAllCategories, getCategory } from "../../controllers/categories.controllers";

const router = express.Router();

router.route("/").get(getAllCategories).post(createNewCategory);
router.route("/:id").get(getCategory).delete(deleteCategory);

export default router;