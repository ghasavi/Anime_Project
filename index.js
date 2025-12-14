import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import animeRouter from './routes/animeRouter.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    const tokenString = req.header("Authorization");

    // No token → allow public routes
    if (!tokenString) {
        return next();
    }

    const token = tokenString.replace("Bearer ", "");

    jwt.verify(token,process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        // Save decoded user into request
        req.user = decoded;

        next();
    });
});


mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection failed:", err));

app.use("/users", userRouter);
app.use("/animes", animeRouter);


app.listen( 3000,
    ()=>{
        console.log('Server is running on port 3000');
    }
)
