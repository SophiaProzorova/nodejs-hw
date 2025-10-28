import { model, Schema } from "mongoose";

const NoteSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            default: "",
            required: false,
            trim: true,
        },
        tag: {
            type: String,
            enum: ["Work", "Personal", "Meeting", "Shopping", "Ideas", "Travel", "Finance", "Health", "Important", "Todo"],
            default: "Todo",
        }
    },
    {
         timestamps: true,
    }
);

NoteSchema.index({title: "text", content: "text"});

export const Note = model("Note", NoteSchema);