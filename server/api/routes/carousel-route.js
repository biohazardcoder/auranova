import express from "express"
import { CreateCarousel, DeleteCarousel, GetAllCarousels, GetCarouselById } from "../controllers/carousel-controller.js"
import uploadImage from "../../middlewares/uploadImage.js"

const router = express.Router()
router.get("/", GetAllCarousels)
router.get("/:id", GetCarouselById)
router.post("/create", uploadImage, CreateCarousel)
router.delete("/:id", DeleteCarousel)


export default router
