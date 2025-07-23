import { Comment } from "../models/comment";
import { fetchData } from "./fetch_api";

export interface CommentInput {
    poster: string,
    posterId: string,
    ticketId: string,
    content: string,
}

export async function fetchComments(ticketId: string): Promise<Comment[]> {
    
    const response = await fetchData("/api/comments/" + ticketId, { method: "GET" });
    return response.json();
}

export async function postComment(postedComment: CommentInput) {

    const response = await fetchData("/api/comments/" + postedComment.ticketId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postedComment),
    });
    return response.json();
}

export async function deleteComment(ticketId: string, commentId: string) {

    await fetchData(`/api/comments/${ticketId}/${commentId}`, {
        method: "DELETE",
    });
}

