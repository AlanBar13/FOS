import express from "express";
import { getUser, getUsers, registerUser, deleteUser } from '../../controllers/user.controller';

const router = express.Router();

// TODO Add route to change password

router.route("/").get(getUsers).post(registerUser);
router.route("/:id").get(getUser).delete(deleteUser);

export default router;