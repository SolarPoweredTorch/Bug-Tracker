import { RequestHandler } from "express";
import createHttpError from "http-errors";
import ShortUniqueId from "short-unique-id";
import CommentModel from "../models/comment";
import TicketModel from "../models/ticket";
import UserModel from "../models/user";
import { addNewNotificationByBackend, NotificationBody } from "./notificationController";

interface CommentParams {
    ticketId: string,
    commentId: string,
}

export const getTicketComments: RequestHandler<CommentParams, unknown, unknown, unknown> = async (req, res, next) => {

    const ticketId = req.params.ticketId;

    try {
        const comments = await CommentModel.find({ ticketId: ticketId }).exec();
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}

interface CommentBody {
    poster: string,
    posterId: string,
    content: string,
}

export const postComment: RequestHandler<CommentParams, unknown, CommentBody, unknown> = async (req, res, next) => {

    const uid = new ShortUniqueId();

    const id = uid.rnd();
    const ticketId = req.params.ticketId;

    const poster = req.body.poster;
    const posterId = req.body.posterId;
    const content = req.body.content;

    try {

        if (!id) throw createHttpError(400, "There was an server error. Please try again later");
        if (!poster) throw createHttpError(400, "There was a user identification error.");
        if (!content) throw createHttpError(400, "There is nothing to post.");

        const ticket = await TicketModel.findOne({ id: ticketId });

        if (!ticket) throw createHttpError(404, "Ticket not found.");

        ticket.$inc("commentCount", 1);
        await ticket.save();

        const newComment = await CommentModel.create({
            id: id,
            poster: poster,
            posterId: posterId,
            ticketId: ticketId,
            content: content,
        });

        // Create notifications for ticket author and assigned users

        if (posterId !== ticket.authorId) {
            const notification: NotificationBody = {
                userId: ticket.authorId,
                message: `New comment by ${poster} on your authored ticket ${ticketId}`,
                link: `/tickets/${ticketId}`,
            }
            addNewNotificationByBackend(notification);
        }

        ticket.assignees.forEach(async username => {

            try {
                const user = await UserModel.findOne({ username: username });
                if (posterId !== user!._id.toString()) {
                    const notification: NotificationBody = {
                        userId: user!._id.toString(),
                        message: `New comment by ${poster} on ticket ${ticketId}`,
                        link: `/tickets/${ticketId}`,
                    }
                    addNewNotificationByBackend(notification);
                }
            } catch (error) {
                next(error);
            }
        });

        res.status(201).json(newComment);

    } catch (error) {
        next(error);
    }
}

export const deleteComment: RequestHandler<CommentParams, unknown, unknown, unknown> = async (req, res, next) => {

    const commentId = req.params.commentId;

    try {

        const comment = await CommentModel.findOne({ id: commentId }).exec();

        if (!comment) {
            throw createHttpError(404, "Comment not found.");
        }

        const ticket = await TicketModel.findOne({ id: comment.ticketId });

        await comment.deleteOne();

        if (ticket) {
            ticket.$inc("commentCount", -1);
            await ticket.save();
        }

        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}
