import express from "express";
import { getAllNotes, getOneNote, createNote, modifyNote, deleteNote} from "../controllers/notesController.js";


const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", getOneNote);
router.post("/", createNote);
router.put("/:id", modifyNote);
router.delete("/:id", deleteNote);

export default router;