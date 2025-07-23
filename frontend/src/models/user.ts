import { UserNotification } from "./userNotification";

export interface User {
    _id: string,
    realName?: string,
    username: string,
    email: string,
    createdAt: string,
    location?: string,
    assignments?: string[],
    notifications: UserNotification[],
}