import { RequestHandler } from "express";
import createHttpError from "http-errors";
import ShortUniqueId from "short-unique-id";
import TicketModel from "../models/ticket";
import UserModel from "../models/user";
import { formatArrayToPlainText } from "../util/formatArrayToPlainText";
import { addNewNotificationByBackend, NotificationBody } from "./notificationController";
import { updateUserAssignments } from "./userController";

export const getTickets: RequestHandler = async (req, res, next) => {

    try {
        const tickets = await TicketModel.find().exec();
        res.status(200).json(tickets);
    } catch (error) {
        next(error);
    }
}

export const getTicket: RequestHandler = async (req, res, next) => {

    const ticketId = req.params.ticketId;

    try {

        const ticket = await TicketModel.findOne({ id: ticketId }).exec();

        if (!ticket) {
            throw createHttpError(404, "Ticket not found. It may have been deleted, or perhaps it never did exist.");
        }

        res.status(200).json(ticket);

    } catch (error) {
        next(error);
    }
}

interface TicketBody {
    id?: string,
    summary?: string,
    type?: string,
    severity?: string,
    status?: string,
    description?: string,
    commentCount?: number,
    author?: string,
    authorId?: string,
    assignees?: string[],
}

export const createTicket: RequestHandler<unknown, unknown, TicketBody, unknown> = async (req, res, next) => {

    const uid = new ShortUniqueId();

    const id = uid.rnd();
    const summary = req.body.summary;
    const type = req.body.type;
    const severity = req.body.severity;
    const status = req.body.status;
    const description = req.body.description;
    const author = req.body.author;
    const authorId = req.body.authorId;
    const assignees = req.body.assignees;

    try {

        if (!id) throw createHttpError(400, "There was a server error. Please try again later");
        if (!summary) throw createHttpError(400, "A short summary is required.");
        if (!type) throw createHttpError(400, "Bug type is required.");
        if (!severity) throw createHttpError(400, "Severity level is required.");
        if (!status) throw createHttpError(400, "A bug status is required.");
        if (!author || !authorId) throw createHttpError(400, "A user identification error has occured.");

        const newTicket = await TicketModel.create({
            id: id,
            summary: summary,
            type: type,
            severity: severity,
            status: status,
            description: description,
            commentCount: 0,
            author: author,
            authorId: authorId,
            assignees: assignees,
        });

        res.status(201).json(newTicket);

    } catch (error) {
        next(error);
    }
}

interface TicketParams {
    ticketId: string,
}

interface TicketUpdateRequest {
    updatedTicket: TicketBody,
    editor: string,
}

export const updateTicket: RequestHandler<TicketParams, unknown, TicketUpdateRequest, unknown> = async (req, res, next) => {

    const ticketId = req.params.ticketId;

    const newSummary = req.body.updatedTicket.summary;
    const newType = req.body.updatedTicket.type;
    const newSeverity = req.body.updatedTicket.severity;
    const newStatus = req.body.updatedTicket.status;
    const newDescription = req.body.updatedTicket.description;
    const newAssignees = req.body.updatedTicket.assignees;

    const editor = req.body.editor;

    try {

        const ticket = await TicketModel.findOne({ id: ticketId }).exec();

        if (!ticket) {
            throw createHttpError(404, "Ticket not found.");
        }

        // Handle field changes

        let changedFields = [];

        if (newSummary) {
            if (ticket.summary !== newSummary) {
                ticket.summary = newSummary;
                changedFields.push("summary");
            }
        }

        if (newType) {
            if (ticket.type !== newType) {
                ticket.type = newType;
                changedFields.push("type");
            }
        }

        if (newSeverity) {
            if (ticket.severity !== newSeverity) {
                ticket.severity = newSeverity;
                changedFields.push("severity");
            }
        }

        if (newStatus) {
            if (ticket.status !== newStatus) {
                ticket.status = newStatus;
                changedFields.push("status");
            }
        }

        if (newDescription) {
            if (ticket.description !== newDescription) {
                ticket.description = newDescription;
                changedFields.push("description");
            }
        }

        // Create notifications for ticket author and assigned users

        if (changedFields.length > 0) {

            const changedFieldsString = formatArrayToPlainText(changedFields, true);

            if (ticket.author !== "System" && editor !== ticket.author) {
                const notification: NotificationBody = {
                    userId: ticket.author,
                    message: `${changedFieldsString} ${changedFields.length > 1 ? "have" : "has"} been changed on your authored ticket ${ticketId}`,
                    link: `/tickets/${ticketId}`,
                }
                addNewNotificationByBackend(notification);
            }

            if (ticket.assignees) {

                ticket.assignees.forEach(async username => {

                    if (username !== editor) {
                        try {
                            const user = await UserModel.findOne({ username: username });
                            const notification: NotificationBody = {
                                userId: user!._id.toString(),
                                message: `${changedFieldsString} ${changedFields.length > 1 ? "have" : "has"} been changed on ticket ${ticketId}`,
                                link: `/tickets/${ticketId}`,
                            }
                            addNewNotificationByBackend(notification);
                        } catch (error) {
                            next(error);
                        }
                    }
                });
            }
        }


        // Handle assignment changes

        if (newAssignees) {

            const addList: string[] = [];
            const removeList: string[] = [];

            ticket.assignees.forEach(username => {
                if (!newAssignees.includes(username)) {
                    removeList.push(username);
                }
            });

            newAssignees.forEach(username => {
                if (!ticket.assignees.includes(username)) {
                    addList.push(username);
                }
            });

            updateUserAssignments(ticketId, addList, removeList);
            ticket.assignees = newAssignees;

            // Create notifications for added / removed users

            addList.forEach(async username => {

                if (username !== editor) {
                    try {
                        const user = await UserModel.findOne({ username: username });
                        const notification: NotificationBody = {
                            userId: user!._id.toString(),
                            message: `You've been assigned to ticket ${ticketId}`,
                            link: `/tickets/${ticketId}`,
                        }
                        addNewNotificationByBackend(notification);
                    } catch (error) {
                        next(error);
                    }
                }
            });

            removeList.forEach(async username => {

                if (username !== editor) {
                    try {
                        const user = await UserModel.findOne({ username: username });
                        const notification: NotificationBody = {
                            userId: user!._id.toString(),
                            message: `You've been unassigned from ticket ${ticketId}`,
                            link: `/tickets/${ticketId}`,
                        }
                        addNewNotificationByBackend(notification);
                    } catch (error) {
                        next(error);
                    }
                }
            });
        }

        const updatedTicket = await ticket.save();

        res.status(200)
            .json(updatedTicket);

    } catch (error) {
        next(error);
    }
}

export const deleteTicket: RequestHandler = async (req, res, next) => {

    const ticketId = req.params.ticketId;

    try {

        const ticket = await TicketModel.findOne({ id: ticketId }).exec();

        if (!ticket) {
            throw createHttpError(404, "Ticket not found. It may have already been deleted.");
        }

        else {
            await ticket.deleteOne();
            res.sendStatus(204);
        }

    } catch (error) {
        next(error);
    }
}