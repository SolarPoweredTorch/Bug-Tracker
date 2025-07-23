import { fetchData } from "./fetch_api";

export async function setNotificationsToInactive() {
    const response = await fetchData("/api/notifications/reset", { method: "GET" });
    return response;
}

export interface NotificationInput {
    userId: string,
    message: string,
    link?: string,
}

export async function addNewNotification(notificationInput: NotificationInput) {

    const response = await fetchData("/api/notifications/add",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(notificationInput),
        });

    return response;
}