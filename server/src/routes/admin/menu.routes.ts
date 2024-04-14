import express from "express";
import {
  getMenuItems,
  registerMenuItem,
  updateItem,
  getItem,
  deleteItem,
  uploadMenuImage,
} from "../../controllers/menu.controller";
import { upload } from "../../utils/uploadS3";
import { verifyCache } from "../../middleware/cacheMiddleware";

const router = express.Router();

router.route("/").get(getMenuItems).post(registerMenuItem);
router.route("/:id").get(getItem).patch(updateItem).delete(deleteItem);
router.route("/image/upload").post(upload.single("img"), uploadMenuImage);

export default router;
