import { RequestHandler } from "express";
import CommentModel from "../models/comment";
import TicketModel from "../models/ticket";
import UserModel from "../models/user";

// For general functions which don't (yet) merit their own dedicated routes and controllers

export const getStats: RequestHandler = async (req, res, next) => {

    interface StatisticsData {
        ticketCount: number,
        userCount: number,
        commentCount: number,

        ticketsNew: number,
        ticketsInProgress: number,
        ticketsResolved: number,
        ticketsFeedbackNeeded: number,
        ticketsRejected: number,
        ticketsOnHold: number,

        ticketsUnknown: number,
        ticketsLow: number,
        ticketsModerate: number,
        ticketsHigh: number,
        ticketsCritical: number,
    }

    try {
        const ticketCount = await TicketModel.countDocuments();
        const userCount = await UserModel.countDocuments();
        const commentCount = await CommentModel.countDocuments();

        const ticketsNew = await TicketModel.countDocuments({ status: "New" });
        const ticketsInProgress = await TicketModel.countDocuments({ status: "In progress" });
        const ticketsResolved = await TicketModel.countDocuments({ status: "Resolved" });
        const ticketsFeedbackNeeded = await TicketModel.countDocuments({ status: "Feedback needed" });
        const ticketsRejected = await TicketModel.countDocuments({ status: "Rejected" });
        const ticketsOnHold = await TicketModel.countDocuments({ status: "On hold" });

        const ticketsUnknown = await TicketModel.countDocuments({ severity: "Unknown" });
        const ticketsLow = await TicketModel.countDocuments({ severity: "Low" });
        const ticketsModerate = await TicketModel.countDocuments({ severity: "Moderate" });
        const ticketsHigh = await TicketModel.countDocuments({ severity: "High" });
        const ticketsCritical = await TicketModel.countDocuments({ severity: "Critical" });

        const stats: StatisticsData = {
            ticketCount,
            userCount,
            commentCount,
            ticketsNew,
            ticketsInProgress,
            ticketsResolved,
            ticketsFeedbackNeeded,
            ticketsRejected,
            ticketsOnHold,
            ticketsUnknown,
            ticketsLow,
            ticketsModerate,
            ticketsHigh,
            ticketsCritical,
        }

        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
}