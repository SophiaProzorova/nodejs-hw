import { Note } from "../models/note.js";
import createHttpError from "http-errors";

export const getNotes = async (req, res) => {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const skip = (page - 1) * perPage;
    const notesQuery =  Note.find();

    if (tag) {
       notesQuery.where("tag").equals(tag); 
    }
    if (search) {
        notesQuery.where({
            $text: {$search: search}
        });
    }

    const [totalNotes, notes] = await Promise.all([
        notesQuery.clone().countDocuments(),
        notesQuery.skip(skip).limit(perPage),
    ]);

    const totalPage = Math.ceil(totalNotes / perPage);

    res.status(200).json({
        page,
        perPage,
        totalNotes,
        totalPage,
        notes
    });
};

export const getNotebyId = async (req, res, next) => {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
        next(new Error("Note is not found"));
        return;
    }

    res.status(200).json(note);
};

export const createNote = async (req, res) => {
    const note = await Note.create(req.body);
    res.status(201).json(note);
};

export const deleteNote = async (req, res, next) => {
    const { noteId } = req.params;
    const note = await Note.findByIdAndDelete({
        _id: noteId
    });

    if (!noteId) {
        next(createHttpError(404, "Note is not found"));
        return;
    };

    res.status(200).json(note);
};

export const updateNote = async (req, res, next) => {
    const { noteId } = req.params;

    const note = await Note.findByIdAndUpdate(
        {_id: noteId},
        req.body,
        {new: true},
    );

    if (!note) {
        next(createHttpError(404, "Note is not fould"));
        return;
    };

    res.status(200).json(note);
};