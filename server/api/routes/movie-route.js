import express from "express"
import uploadImage from "../../middlewares/uploadImage.js"
import uploadVideo from "../../middlewares/uploadVideo.js"
import { AddCommentary, AddLike, AddVideo, CreateMovie, DeleteMovie, DeleteVideo, GetAllMovies, GetMovieById, GetMovieByRandom, GetMoviesByGenre } from "../controllers/movie-controller.js"

const router = express.Router()

router.get("/", GetAllMovies)
router.get("/:id", GetMovieById)
router.get("/random/4", GetMovieByRandom)
router.get("/genre/:value", GetMoviesByGenre)
router.post("/like/:id", AddLike)
router.post("/create", uploadImage, CreateMovie)
router.post("/:id/video", uploadVideo, AddVideo)
router.post("/add-commentary", AddCommentary)
router.delete("/:id", DeleteMovie)
router.delete("/:id/video", DeleteVideo)

export default router