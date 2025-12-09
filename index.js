import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import animeRouter from './routes/animeRouter.js';
import jwt from 'jsonwebtoken';

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    const tokenString = req.header("Authorization");

    if (tokenString != null) {

    

    const token = tokenString.replace("Bearer ", "");

    jwt.verify(token, "aviusersecret-key", (err, decoded) => {
        if (err,decoded) {
            return res.status(403).json({
                message: "Invalid token"
            });
        }
    })
}else{
    next()
}
})

mongoose.connect("mongodb+srv://admin:123@cluster0.rbs31bm.mongodb.net/?appName=Cluster0").then(()=>{
    console.log("Connected to MongoDB");
}).catch(()=>{
    console.log("MongoBD Connection failed");
})

app.use("/users", userRouter);
app.use("/animes", animeRouter);


app.listen( 3000,
    ()=>{
        console.log('Server is running on port 3000');
    }
)
//mongodb+srv://admin:123@cluster0.rbs31bm.mongodb.net/?appName=Cluster0