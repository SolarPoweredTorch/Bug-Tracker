export interface UserNotification {
    userId: string,
    id: string,
    createdAt: string,
    message: string,
    link?: string,
    active: boolean,
}