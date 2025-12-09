import express from 'express';
import { deleteAnime, getAnimes, saveAnime } from '../controllers/animeController.js';

const animeRouter = express.Router();

animeRouter.get("/", getAnimes);

animeRouter.post("/", saveAnime);

animeRouter.delete("/:animeId", deleteAnime);

export default animeRouter;