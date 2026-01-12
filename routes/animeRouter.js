import express from "express";
import {
  deleteAnime,
  getAnimeById,
  getAnimes,
  saveAnime,
  updateAnime,
} from "../controllers/animeController.js";

import verifyAdmin from "../middleware/verifyAdmin.js";

const animeRouter = express.Router();

/* =================== PUBLIC =================== */

// Get all animes
animeRouter.get("/", getAnimes);

// Get single anime
animeRouter.get("/:animeId", getAnimeById);

/* =================== ADMIN ONLY =================== */

// Add anime
animeRouter.post("/", verifyAdmin, saveAnime);

// Update anime
animeRouter.put("/:animeId", verifyAdmin, updateAnime);

// Delete anime
animeRouter.delete("/:animeId", verifyAdmin, deleteAnime);

export default animeRouter;
