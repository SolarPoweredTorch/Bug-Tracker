
export interface Ticket {
    // _id: string,  // Mongoose Id
    id: string,
    summary: string,
    type: string,
    severity: string,
    status: string,
    description?: string,
    commentCount: number,
    author: string,
    authorId: string,
    assignees?: string[],
    createdAt: string,
    updatedAt: string,
}