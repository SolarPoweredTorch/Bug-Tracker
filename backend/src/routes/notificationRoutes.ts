import express from "express";
import * as notificationController from "../controllers/notificationController";

const router = express.Router();

// dir: /api/notifications

router.get("/", notificationController.sendNewNotifications);
router.get("/reset", notificationController.setNotificationsToInactive);

router.post("/add", notificationController.addNewNotificationByRequest);

export default router;