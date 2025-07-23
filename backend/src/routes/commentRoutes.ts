import express from "express";
import * as commentController from "../controllers/commentController";

const router = express.Router();

router.get("/:ticketId", commentController.getTicketComments);
// router.get("/:ticketId/:commentId", commentController.getComment);

router.post("/:ticketId", commentController.postComment);

router.delete("/:ticketId/:commentId", commentController.deleteComment);

export default router;