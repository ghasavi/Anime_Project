import mongoose from "mongoose";

const animeSchema = mongoose.Schema({
  name: { type: String, required: true },
  altNames: [{ type: String }], // other names / Japanese / nicknames
  description: { type: String, required: true },
  genres: [{ type: String, required: true }], // e.g., action, fantasy
  tags: [{ type: String }], // more detailed tags, e.g., "shounen", "mecha", "romance"
  releaseYear: { type: Number },
  rating: { type: Number, default: 0 }, // aggregate rating or score
  image: { type: String, required: true }, // main poster image
  episodes: { type: Number },
  status: { type: String, enum: ["Ongoing", "Completed", "Upcoming"], default: "Completed" },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Anime = mongoose.model("Anime", animeSchema);

export default Anime;
