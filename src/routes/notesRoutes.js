import { Router } from "express";
import { createNote, deleteNote, getNotebyId, getAllNotes, updateNote } from "../controllers/notesController.js";
import { getAllNotesSchema, deleteNoteSchema, updateNoteSchema, noteIdSchema, createNoteSchema } from "../validations/notesValidation.js";
import { celebrate } from "celebrate";

const router = Router();

router.get("/notes", celebrate(getAllNotesSchema), getAllNotes);

router.get("/notes/:noteId", celebrate(noteIdSchema), getNotebyId);

router.post("/notes", celebrate(createNoteSchema), createNote);

router.delete("/notes/:noteId", celebrate(deleteNoteSchema), deleteNote);

router.patch("/notes/:noteId", celebrate(updateNoteSchema), updateNote);

export default router;