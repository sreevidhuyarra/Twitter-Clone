import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import dotenv from "dotenv";
import connectMongo from "./db/connectMongo.js";
import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})
const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}) );


app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/notifications",notificationRoutes);

app.listen(PORT,()=>{
    console.log(`Server started at ${PORT}`);
    connectMongo();
});

