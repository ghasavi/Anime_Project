import mongoose from "mongoose";

const animeSchema = mongoose.Schema({
    title: String,
    genre: String,
    episodes: Number,
    rating: Number
});

const Anime = mongoose.model("Anime", animeSchema);

export default Anime;
