import { Ticket } from "../models/ticket";
import { randomizeTicket } from "../util/randomizeTicket";
import { fetchData } from "./fetch_api";

export async function fetchTickets(): Promise<Ticket[]> {

    const response = await fetchData("/api/tickets", { method: "GET" });
    return response.json();
}

export async function getTicket(ticketId: string): Promise<Ticket> {

    const response = await fetchData(`/api/tickets/${ticketId}`, { method: "GET" });
    return response.json();
}

export interface TicketInput {
    summary: string,
    type: string,
    severity: string,
    status: string,
    description?: string,
    author: string,
    authorId: string,
    assignees?: string[],
}

export async function createTicket(createdTicket: TicketInput) {

    const response = await fetchData("/api/tickets/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(createdTicket),
    });
    return response.json();
}

export async function createRandomTicket() {

    const response = await createTicket(randomizeTicket());
    return response;
}

export async function deleteTicket(ticketId: string) {

    await fetchData("/api/tickets/" + ticketId, {
        method: "DELETE",
    });
}

export async function updateTicket(ticketId: string, updatedTicket: TicketInput, editor: string): Promise<Ticket> {

    const response = await fetchData("/api/tickets/" + ticketId, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            updatedTicket,
            editor,
        }),
    });
    return response.json();
}