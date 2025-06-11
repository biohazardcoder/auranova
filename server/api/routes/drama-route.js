import express from "express"
import { AddCommentary, AddLike, CreateDrama, CreatePart, DeleteDrama, DeletePart, GetAllDramas, GetDramaById, GetDramasByGenre, GetDramasByRandom } from "../controllers/drama-controller.js"
import uploadImage from "../../middlewares/uploadImage.js"
import uploadVideo from "../../middlewares/uploadVideo.js"

const router = express.Router()

router.get("/", GetAllDramas)
router.get("/:id", GetDramaById)
router.get("/random/4", GetDramasByRandom)
router.get("/genre/:value", GetDramasByGenre)
router.post("/create", uploadImage, CreateDrama)
router.post("/part", uploadVideo, CreatePart)
router.post("/add-commentary", AddCommentary)
router.post("/like/:id", AddLike)
router.delete("/:id", DeleteDrama)
router.delete("/:id/part/:partId", DeletePart);

export default router