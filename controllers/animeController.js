import Anime from '../models/anime.js';
import { isAdmin } from './adminController.js';

export async function getAnimes(req, res) {
  try {
    let animes;
    if (isAdmin(req)) {
      animes = await Anime.find();
      console.log("Fetched all animes (admin):", animes.length);
    } else {
      animes = await Anime.find({ isAvailable: true });
      console.log("Fetched available animes:", animes.length);
    }
    res.json(animes);
  } catch (err) {
    console.error("Error retrieving animes:", err);
    res.status(500).json({
      message: "Error retrieving animes",
      error: err
    });
  }
}

export async function saveAnime(req, res) {
  console.log("REQ BODY for new anime:", req.body);

  if (!isAdmin(req)) {
    console.warn("Unauthorized add anime attempt");
    return res.status(403).json({ message: "Only admins can add new animes" });
  }

  // Validate required fields
  const { name, description, image, genres } = req.body;
  if (!name || !description || !image || !genres || genres.length === 0) {
    console.warn("Validation failed: missing required fields");
    return res.status(400).json({
      message: "Validation failed: name, description, genres, and image are required",
      received: req.body
    });
  }

  const anime = new Anime(req.body);

  try {
    const savedAnime = await anime.save();
    console.log("Anime saved successfully:", savedAnime._id);
    res.json({
      message: "Anime added successfully",
      anime: savedAnime
    });
  } catch (err) {
    console.error("MongoDB save error:", err);
    res.status(500).json({
      message: "Error adding anime",
      error: err
    });
  }
}

export async function deleteAnime(req, res) {
  if (!isAdmin(req)) {
    console.warn("Unauthorized delete anime attempt");
    return res.status(403).json({ message: "Only admins can delete animes" });
  }

  const animeId = req.params.animeId;

  try {
    const result = await Anime.deleteOne({ animeId });
    console.log("Anime delete result:", result);
    res.json({ message: "Anime deleted successfully", result });
  } catch (err) {
    console.error("Error deleting anime:", err);
    res.status(500).json({ message: "Error deleting anime", error: err });
  }
}

export async function updateAnime(req, res) {
  if (!isAdmin(req)) {
    console.warn("Unauthorized update anime attempt");
    return res.status(403).json({ message: "Only admins can update animes" });
  }

  const animeId = req.params.animeId;
  const updateData = req.body;

  console.log("Updating anime:", animeId, "with data:", updateData);

  try {
    const result = await Anime.updateOne({ animeId }, updateData);
    console.log("Update result:", result);
    res.json({ message: "Anime updated successfully", result });
  } catch (err) {
    console.error("Error updating anime:", err);
    res.status(500).json({ message: "Error updating anime", error: err });
  }
}

export async function getAnimeById(req, res) {
  const animeId = req.params.animeId;

  try {
    const anime = await Anime.findOne({ animeId });
    if (!anime) {
      console.warn("Anime not found:", animeId);
      return res.status(404).json({ message: "Anime not found" });
    }

    if (anime.isAvailable) {
      console.log("Returning available anime:", animeId);
      res.json(anime);
    } else {
      if (isAdmin(req)) {
        console.warn("Anime is not available for admin access:", animeId);
        res.status(403).json({ message: "Anime is not available" });
      } else {
        console.log("Returning unavailable anime to admin:", animeId);
        res.json(anime);
      }
    }
  } catch (err) {
    console.error("Error retrieving anime:", err);
    res.status(500).json({ message: "Error retrieving anime", error: err });
  }
}
