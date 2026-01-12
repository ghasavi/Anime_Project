import express from "express";
import { getRecommendations } from "../controllers/recommendationController.js";

const router = express.Router();

// GET /api/recommend?genres=action, fantasy&tags=shounen&minRating=7
router.get("/", getRecommendations);

export default router;
