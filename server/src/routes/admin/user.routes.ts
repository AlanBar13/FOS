import express from "express";
import { getUser, getUsers, registerUser, deleteUser } from '../../controllers/user.controller';
import { protectRoutes } from "../../middleware/authMiddleware";

const router = express.Router();

// TODO Add route to change password

router.route("/").get(protectRoutes, getUsers).post(protectRoutes, registerUser);
router.route("/:id").get(protectRoutes, getUser).delete(protectRoutes, deleteUser);

export default router;