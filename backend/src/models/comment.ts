import { InferSchemaType, model, Schema } from "mongoose";

const commentSchema = new Schema({
    id:         { type: String, required: true },
    poster:     { type: String, required: true },
    posterId:   { type: String, required: true },
    ticketId:   { type: String, required: true },
    content:    { type: String, required: true },

}, { timestamps: true });

type Comment = InferSchemaType<typeof commentSchema>;

export default model<Comment>("Comment", commentSchema);
