import { NextFunction, Request, Response } from "express";
import { RequestHandler } from "express-serve-static-core";
import createHttpError from "http-errors";
import { Types } from "mongoose";
import ShortUniqueId from "short-unique-id";
import UserModel from "../models/user";

/* Client list object, functions, etc. */

interface ClientData {
    userId: Types.ObjectId,
    res: Response,
    newNotifications: Notification[];
}

let clients: ClientData[] = [];

const addClient = (userId: Types.ObjectId, res: Response, newNotifications?: Notification[]) => {

    res.writeHead(200, {
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream",
        "Content-Encoding": "none",
    });

    clients.push({
        userId: userId,
        res: res,
        newNotifications: newNotifications ?? []
    });
}

const removeClient = (userId: Types.ObjectId) => {
    clients = clients.filter(client => client.userId !== userId);
}

/* Server-sent events loop */

setInterval(() => {
    // console.log("Clients connected: " + clients.length);
    clients.forEach(client => {
        const newNotifications = client.newNotifications;
        if (newNotifications.length > 0) {
            client.res.write(`event: newNotifications\n`);
            client.res.write(`data: ${JSON.stringify(newNotifications)}\n\n`);
            console.log("Sending data to the front...");
            client.newNotifications = [];
        }
    });
}, 3000);

/* Subscription handler */

export const sendNewNotifications = async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.session.userId;

    if (userId) {

        let existingClient = clients.find(client => client.userId === userId);

        if (existingClient) {
            const carriedNotifications = existingClient.newNotifications;
            removeClient(userId);
            addClient(userId, res, carriedNotifications);
            // console.log("Replacing old client");
        }
        else {
            addClient(userId, res);
            // console.log("Adding new client");
        }

        req.on("close", () => {
            removeClient(userId);
            res.end();
            // console.log("Closing connection to user " + userId?.toString());
        });
    }
}

export interface NotificationBody {
    userId?: string,
    message?: string,
    link?: string,
}

interface Notification {
    userId: string,
    id: string,
    createdAt: string,
    message: string,
    link: string,
    active: boolean,
}

export const addNewNotificationByRequest: RequestHandler<unknown, unknown, NotificationBody, unknown> = async (req, res, next) => {

    if ((!req.body.userId) || (!req.body.message)) {
        throw createHttpError(400, "Malformed notification request.");
    }

    const notificationInput: NotificationBody = {
        userId: req.body.userId,
        message: req.body.message,
        link: req.body.link ?? "",
    };

    try {
        createNotification(notificationInput);
        res.sendStatus(201);
    } catch (error) {
        next(error);
    }
}

export const addNewNotificationByBackend = async (notificationInput: NotificationBody) => {

    try {
        createNotification(notificationInput);
    } catch (error) {
        throw new Error("Error processing notification");
    }
}

const createNotification = async (notificationInput: NotificationBody) => {

    // No notifications for the system "user"
    if (notificationInput.userId === "0" || notificationInput.userId === "000000000000000000000000") {
        return;
    }

    const uid = new ShortUniqueId();

    const user = await UserModel.findOne({ _id: notificationInput.userId }).exec();

    if (!user) {
        throw createHttpError(404, "User not found.");
    }

    const newNotification: Notification = { // Values are validated in the calling functions
        userId: notificationInput.userId!,
        id: uid.rnd(),
        createdAt: new Date(Date.now()).toISOString(),
        message: notificationInput.message!,
        link: notificationInput.link!,
        active: true,
    }

    const query = { _id: notificationInput.userId };
    const update = { $push: { notifications: newNotification } };
    await UserModel.updateOne(query, update).exec();

    let activeClient = clients.find(client => client.userId.toString() === notificationInput.userId)
    if (activeClient) {
        activeClient.newNotifications.push(newNotification);
    }
}

export const setNotificationsToInactive: RequestHandler = async (req, res, next) => {

    const userId = req.session.userId;

    try {

        const user = await UserModel.findOne({ _id: userId }).exec();

        if (!user) {
            throw createHttpError(404, "User not found.");
        }

        user.notifications = user.notifications.map(n => { return { ...n, active: false } });

        await user.save();
        res.sendStatus(200);

    } catch (error) {
        next(error);
    }
}