import { formatDate } from "./formatDate";

export function toElapsedTime(dateString: string): string {

    const targetTime = new Date(dateString);
    const currentTime = new Date();

    const differenceinMilliseconds = currentTime.valueOf() - targetTime.valueOf();
    const differenceinSeconds = differenceinMilliseconds / 1000;
    const differenceinMinutes = differenceinSeconds / 60;
    const differenceinHours = differenceinMinutes / 60;

    let elapsedTime = "On " + formatDate(targetTime.toString());

    if (differenceinSeconds < 5)
        elapsedTime = "Just now";
    else if (differenceinSeconds < 60)
        elapsedTime = "A few seconds ago";
    else if (differenceinMinutes < 2)
        elapsedTime = "One minute ago";
    else if (differenceinMinutes < 60)
        elapsedTime = Math.floor(differenceinMinutes) + " minutes ago";
    else if (differenceinHours < 2)
        elapsedTime = "One hour ago";
    else if (differenceinHours < 24)
        elapsedTime = Math.floor(differenceinHours) + " hours ago";

    return elapsedTime;
}