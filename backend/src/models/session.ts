import { InferSchemaType, model, Schema } from "mongoose";

const sessionSchema = new Schema({
    _id: { type: String },
    session: { type: String, unique: true, },
    expires: { type: Date },

}, { timestamps: false });

type Session = InferSchemaType<typeof sessionSchema>;

export default model<Session>("Session", sessionSchema);