import express from "express"
import { GetAllAnimes, CreateAnime, GetAnimeById, GetAnimesByRandom, CreatePart, DeleteAnime, DeletePart, AddCommentary, GetAnimesByGenre, AddLike } from "../controllers/anime-controller.js"
import uploadImage from "../../middlewares/uploadImage.js"
import uploadVideo from "../../middlewares/uploadVideo.js"

const router = express.Router()

router.get("/", GetAllAnimes)
router.get("/:id", GetAnimeById)
router.get("/random/4", GetAnimesByRandom)
router.get("/genre/:value", GetAnimesByGenre)
router.post("/create", uploadImage, CreateAnime)
router.post("/part", uploadVideo, CreatePart)
router.post("/like/:id", AddLike)
router.post("/add-commentary", AddCommentary)
router.delete("/:id", DeleteAnime)
router.delete("/:id/part/:partId", DeletePart);

export default router