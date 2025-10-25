import { Router } from "express";
import { createNote, deleteNote, getNotebyId, getNotes, updateNote } from "../controllers/notesController.js";

const router = Router();

router.get("/notes", getNotes);

router.get("/notes/:noteId", getNotebyId);

router.post("/notes", createNote);

router.delete("/notes/:noteId", deleteNote);

router.patch("note/:noteId", updateNote);

export default router;