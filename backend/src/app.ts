import MongoStore from "connect-mongo";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import createHttpError, { isHttpError } from "http-errors";
import morgan from "morgan";
import * as generalController from "./controllers/generalController";
import commentRoutes from "./routes/commentRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import userRoutes from "./routes/userRoutes";
import env from "./util/validateEnv";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION,
    }),
}));

app.use("/api/tickets", ticketRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/stats", generalController.getStats);

app.use((req, res, next) => {
    next(createHttpError(404, "Resource not found."));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {

    console.error(error);
    let errorMessage = "An unknown error has occurred."
    let statusCode = 500;

    if (isHttpError(error)) {
        errorMessage = error.message;
        statusCode = error.status;
    }

    res.status(statusCode).json({ error: errorMessage });
});

export default app;