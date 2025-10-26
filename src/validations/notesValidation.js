import { Joi, Segments } from "celebrate";
import { TAGS } from "../constants/tags.js";
import mongoose from "mongoose";

const noteSchema = Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().default(""),
    tag: Joi.string().valid(...TAGS),
});

export const createNoteSchema = {
    [Segments.BODY]: noteSchema,
};

export const getAllNotesSchema = {
    [Segments.QUERY]: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        perPage: Joi.number().integer().min(5).max(20).default(10),
        tag: Joi.string().valid(...TAGS), 
        search: Joi.string().allow("")
    })
};

export const noteIdValidate = Joi.string().custom((value, helpers) => {
    if (!mongoose.isValidObjectId(value)) return helpers.error("any.invalid");
    return value;
});

export const noteIdSchema = {
    [Segments.PARAMS]: Joi.object({
        noteId: noteIdValidate.required(),
    }),
};

export const updateNoteSchema = {
    [Segments.PARAMS]: Joi.object({
        noteId: noteIdValidate.required(),
    }),
    [Segments.BODY]: noteSchema
        .or("title", "content", "tag")
        .messages({
            "object.missing": "At least one of 'title', 'content', 'tag' must be provided",
        })
};

export const deleteNoteSchema = {
    [Segments.PARAMS]: Joi.object({
        noteId: noteIdValidate.required(),
    })
};