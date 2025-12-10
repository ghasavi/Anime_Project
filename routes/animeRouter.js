import express from 'express';
import { deleteAnime, getAnimeById, getAnimes, saveAnime, updateAnime } from '../controllers/animeController.js';

const animeRouter = express.Router();

animeRouter.get("/", getAnimes);

animeRouter.post("/", saveAnime);

animeRouter.delete("/:animeId", deleteAnime);

animeRouter.put("/:animeId", updateAnime);

animeRouter.get("/:animeId", getAnimeById);

export default animeRouter;