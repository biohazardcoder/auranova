import carouselModel from "../models/carousel-model.js";
import fs from "fs/promises";
import path from "path";

export const GetAllCarousels = async (_, res) => {
    try {
        const carousels = await carouselModel.find()
        res.status(200).json(carousels)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Karusellarni olishda xatolik" });
    }
}
export const GetCarouselById = async (req, res) => {
    try {
        const { id } = req.params
        const carousel = await carouselModel.findById(id)
        res.status(200).json(carousel)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Karuselni olishda xatolik" });
    }
}

export const CreateCarousel = async (req, res) => {
    try {
        const { url, type } = req.body
        const carousel = await carouselModel.create(
            {
                url,
                type,
                background: req.uploadedImages[0],
            })
        res.status(200).json(carousel)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Karusel yaratishda xatolik" });
    }
}



export const DeleteCarousel = async (req, res) => {
    try {
        const { id } = req.params;
        const carousel = await carouselModel.findById(id);

        if (!carousel) {
            return res.status(404).json({ message: "Karusel topilmadi" });
        }

        if (carousel.background) {
            const parsedUrl = new URL(carousel.background);
            const relativePath = parsedUrl.pathname.startsWith('/')
                ? parsedUrl.pathname.slice(1)
                : parsedUrl.pathname;

            const imagePath = path.join(process.cwd(), relativePath);

            try {
                fs.unlink(imagePath);
                console.log("Rasm fayl o'chirildi:", imagePath);
            } catch (err) {
                console.error("Rasm faylni o'chirishda xatolik yoki fayl topilmadi:", err);
            }
        }

        await carouselModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Karusel va uning rasmi o'chirildi" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Karusel o'chirishda xatolik" });
    }
};
