import express from "express";
import * as UserController from "../controllers/userController";

const router = express.Router();

// dir: /api/users

router.get("/list/name/:username", UserController.getUserByName);
router.get("/list/id/:userId", UserController.getUserById);
router.get("/list", UserController.getUsers);
router.get("/guest", UserController.createOrLoginGuestUser);
router.get("/", UserController.getAuthenticatedUser);

router.post("/signup", UserController.signUp);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);

router.patch("/:userId", UserController.updateUserInfo);

export default router;