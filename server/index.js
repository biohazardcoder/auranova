import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"
import AdminRoute from "./api/routes/admin-route.js"
import AnimeRoute from "./api/routes/anime-route.js"
import DramaRoute from "./api/routes/drama-route.js"
import MovieRoute from "./api/routes/movie-route.js"
import ContactRoute from "./api/routes/contact-route.js"
import CarouselRoute from "./api/routes/carousel-route.js"
const app = express()

dotenv.config()
app.use(cors())
app.use(express.json());
 
app.use("/uploads", express.static("uploads"));
app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/videos", express.static("uploads/videos"));
app.use("/api/admin", AdminRoute)
app.use("/api/anime", AnimeRoute)
app.use("/api/drama", DramaRoute)
app.use("/api/movie", MovieRoute)
app.use("/api/carousel", CarouselRoute)
app.use("/api/contact", ContactRoute);



app.get("/", (_, res) => {
    res.send("Server is running 🚀");
});
const PORT = process.env.PORT
const MongoDB = process.env.MongoDB
app.listen(PORT, console.log(`✅ Server is running on ${PORT}`))
mongoose.connect(MongoDB, console.log(`🚀 MongoDb connected`))