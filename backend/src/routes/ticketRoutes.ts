import express from "express";
import * as TicketController from "../controllers/ticketController";

const router = express.Router();

router.get("/", TicketController.getTickets);
router.get("/:ticketId", TicketController.getTicket);

router.post("/", TicketController.createTicket);

router.patch("/:ticketId", TicketController.updateTicket);

router.delete("/:ticketId", TicketController.deleteTicket);

export default router;