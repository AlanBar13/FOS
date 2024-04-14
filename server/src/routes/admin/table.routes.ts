import express from "express";
import {
  getTable,
  getTables,
  registerTable,
  updateTable,
  deleteTable,
  registerMultipleTables,
  deleteAllTables,
} from "../../controllers/table.controller";
import { verifyCache } from "../../middleware/cacheMiddleware";

const router = express.Router();

router.route("/multiple/:amount").post(registerMultipleTables);
router.route("/destroy").delete(deleteAllTables);
router.route("/").get(verifyCache, getTables).post(registerTable);
router
  .route("/:id")
  .get(verifyCache, getTable)
  .patch(updateTable)
  .delete(deleteTable);

export default router;
