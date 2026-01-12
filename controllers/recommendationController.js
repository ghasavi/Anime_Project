import Anime from "../models/anime.js";

/* =================== GET RECOMMENDATIONS =================== */
// Accept query params: ?genres=action, fantasy&tags=shounen,adventure&minRating=7
export async function getRecommendations(req, res) {
  try {
    const { genres, tags, minRating, status, limit } = req.query;

    const filter = {};

    if (genres) {
      // convert comma-separated string to array
      const genreArray = genres.split(",").map((g) => g.trim().toLowerCase());
      filter.genres = { $in: genreArray };
    }

    if (tags) {
      const tagArray = tags.split(",").map((t) => t.trim().toLowerCase());
      filter.tags = { $in: tagArray };
    }

    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    if (status) {
      filter.status = status; // must match "Ongoing", "Completed", "Upcoming"
    }

    const results = await Anime.find(filter)
      .sort({ rating: -1, createdAt: -1 }) // top rated + newest first
      .limit(parseInt(limit) || 10); // default 10 recommendations

    res.json({ recommendations: results });
  } catch (err) {
    console.error("Recommendation error:", err);
    res.status(500).json({ message: "Failed to fetch recommendations" });
  }
}
