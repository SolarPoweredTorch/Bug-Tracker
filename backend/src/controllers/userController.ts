import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import ShortUniqueId from "short-unique-id";
import UserModel from "../models/user";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {

    const authenticatedUserId = req.session.userId;

    try {
        if (!authenticatedUserId) {
            throw createHttpError(401, "User is not authenticated.");
        }

        const user = await UserModel
            .findById(authenticatedUserId)
            .exec();
        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
}

export const getUsers: RequestHandler = async (req, res, next) => {

    try {
        const users = await UserModel.find().exec();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const getUserById: RequestHandler = async (req, res, next) => {

    let userId = req.params.userId;
    
    // Kludge for old system-generated tickets. Remove if ticket list is reset.
    if (userId === "0") {
        userId = "000000000000000000000000";
    }

    try {

        if (userId.length != 24) {
            throw createHttpError(400, "Bad request. Please check the URL.");
        }

        const user = await UserModel.findOne({ _id: userId }).exec();

        if (!user) {
            throw createHttpError(404, "User not found.");
        }

        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
}

export const getUserByName: RequestHandler = async (req, res, next) => {

    const username = req.params.username;

    try {

        const user = await UserModel.findOne({ username: username }).exec();

        if (!user) {
            throw createHttpError(404, "No user exists with that name.");
        }

        res.status(200).json(user);

    } catch (error) {
        next(error);
    }
}

interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
    autoLogin?: boolean,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {

    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;
    const autoLogin = req.body.autoLogin;

    try {

        if (!username) throw createHttpError(400, "A username is required.");
        if (!email) throw createHttpError(400, "An email is required.");
        if (!passwordRaw) throw createHttpError(400, "A password is required.");

        const existingUsername = await UserModel.findOne({ username: username }).exec();
        if (existingUsername) {
            throw createHttpError(409, "That username is already taken.");
        }

        const existingEmail = await UserModel.findOne({ email: email }).exec();
        if (existingEmail) {
            throw createHttpError(409, "That email is already registered with a user.");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
            notifications: [],
            newNotifications: [],
        });

        if (autoLogin) {
            req.session.userId = newUser._id;
        }

        res.status(201).json(newUser);

    } catch (error) {
        next(error);
    }
}

interface LoginBody {
    username?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    try {

        if (!username) throw createHttpError(400, "Username is missing.");
        if (!password) throw createHttpError(400, "Password is missing.");

        const user = await UserModel
            .findOne({ username: username })
            .select("+password +email")
            .exec();

        if (!user) {
            throw createHttpError(401, "Invalid credentials.");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials.");
        }

        req.session.userId = user._id;
        res.status(201).json(user);

    } catch (error) {
        next(error);
    }
}

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        }
        else {
            res.sendStatus(200);
        }
    });
}

export const createOrLoginGuestUser: RequestHandler = async (req, res, next) => {

    const existingGuest = await UserModel.findOne({ username: "Guest" }).exec();

    try {
        if (existingGuest) {
            req.session.userId = existingGuest._id;
            res.status(201).json(existingGuest);
        }

        else { // No guest account; create one

            const uid = new ShortUniqueId();
            const passwordHashed = await bcrypt.hash("Guest", 10);

            const newGuestUser = await UserModel.create({
                username: "Guest",
                email: `Guest@${uid.rnd()}.com`,
                password: passwordHashed,
                notifications: [],
            });

            req.session.userId = newGuestUser._id;
            res.status(201).json(newGuestUser);
        }

    } catch (error) {
        next(error);
    }
}

interface UserInfoParams {
    userId: string,
}

interface UserInfoBody {
    location?: string,
    realName?: string,
}

export const updateUserInfo: RequestHandler<UserInfoParams, unknown, UserInfoBody, unknown> = async (req, res, next) => {

    const userId = req.params.userId;

    const newLocation = req.body.location;
    const newRealName = req.body.realName;

    try {

        const user = await UserModel.findOne({ _id: userId }).exec();

        if (!user) {
            throw createHttpError(404, "User not found.");
        }

        if (newLocation)
            user.location = newLocation;

        if (newRealName)
            user.realName = newRealName;

        await user.save();

        res.sendStatus(200);

    } catch (error) {
        next(error);
    }
}

export const updateUserAssignments = async (ticketId: string, addList: string[], removeList: string[]) => {

    try {
        const query = { username: { $in: addList } };
        const update = { $push: { assignments: ticketId } };
        await UserModel.updateMany(query, update).exec();
    } catch (error) {
        console.log(error);
    }

    try {
        const query = { username: { $in: removeList } };
        const update = { $pull: { assignments: ticketId } };
        await UserModel.updateMany(query, update).exec();
    } catch (error) {
        console.log(error);
    }
}