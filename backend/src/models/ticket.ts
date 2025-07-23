import { InferSchemaType, model, Schema } from "mongoose";

const ticketSchema = new Schema({

    id:         { type: String, required: true, unique: true },
    summary:    { type: String, required: true },
    type:       { type: String, required: true },
    severity:   { type: String, required: true },
    status:     { type: String, required: true },

    description:  { type: String },

    commentCount: { type: Number },

    author:   { type: String, required: true },
    authorId: { type: String, required: true },

    assignees: { type: [{ type: String }] }
    
}, { timestamps: true });

type Ticket = InferSchemaType<typeof ticketSchema>;

export default model<Ticket>("Ticket", ticketSchema);