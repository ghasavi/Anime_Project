import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";

import adminRouter from "./routes/adminRouter.js";
import animeRouter from "./routes/animeRouter.js";
import recommendationRouter from "./routes/recommendationRouter.js";

dotenv.config();

const app = express();

/* =================== CORS =================== */
app.use(
  cors({
    origin: ["http://localhost:5173", "https://anime-project-frontend-ten.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

/* =================== BODY PARSER =================== */
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

/* =================== JWT MIDDLEWARE (optional global attach) =================== */
app.use((req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return next(); // public request

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; // attach user info for admin check
  } catch (err) {
    console.warn("Invalid JWT token");
    // don't block public routes, just ignore invalid token
  }
  next();
});

/* =================== DATABASE =================== */
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

/* =================== ROUTES =================== */
app.use("/api/admin", adminRouter);
app.use("/api/animes", animeRouter);
app.use("/api/recommend", recommendationRouter);

/* =================== SERVER =================== */
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
