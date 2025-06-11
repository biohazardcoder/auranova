import animeModel from "../models/anime-model.js";
import fs from "fs/promises";
import path from "path";

export const GetAllAnimes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const total = await animeModel.countDocuments();
        const animes = await animeModel.find().skip(skip).limit(limit);

        res.status(200).json({
            animes,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in get all animes" });
    }
};

export const GetAnimeById = async (req, res) => {
    try {
        const { id } = req.params
        const anime = await animeModel.findById(id)
        res.status(200).json(anime)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in get anime by id" }, error)
    }
}

export const GetAnimesByRandom = async (_, res) => {
    try {
        const fourAnime = await animeModel.aggregate([
            { $sample: { size: 4 } }
        ]);

        res.status(200).json(fourAnime);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in get animes by random" });
    }
};

export const GetAnimesByGenre = async (req, res) => {
    try {
        const { value } = req.params;

        const animes = await animeModel.aggregate([
            { $match: { category: value } },
            { $sample: { size: 8 } }
        ]);

        res.status(200).json(animes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Janr orqali random animelar olishda xatolik" });
    }
};


export const CreateAnime = async (req, res) => {
    try {
        const { title, description, category, made, studio, country } = req.body
        const newAnime = await animeModel.create({
            title,
            description,
            images: req.uploadedImages,
            category,
            made,
            studio,
            country
        })
        res.status(200).json(newAnime)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in create new anime" }, error)
    }
}

export const CreatePart = async (req, res) => {
    try {
        const { title, season, part, anime } = req.body;
        const newPart = {
            title,
            season,
            part,
            video: req.uploadedVideo
        };

        const currentAnime = await animeModel.findById(anime);

        if (!currentAnime) {
            return res.status(404).json({ message: "Anime topilmadi" });
        }

        currentAnime.parts.push(newPart);
        await currentAnime.save();

        res.status(200).json(newPart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Yangi part yaratishda xatolik" });
    }
};

export const DeleteAnime = async (req, res) => {
    try {
        const { id } = req.params;

        const anime = await animeModel.findById(id);
        if (!anime) {
            return res.status(404).json({ message: "Anime topilmadi" });
        }

        if (anime.images && anime.images.length > 0) {
            for (const imageUrl of anime.images) {
                try {
                    const relativePath = imageUrl.startsWith("http")
                        ? new URL(imageUrl).pathname.slice(1)
                        : imageUrl;

                    const fullPath = path.join(process.cwd(), relativePath);
                    await fs.unlink(fullPath);
                    console.log("Rasm fayl o'chirildi:", fullPath);
                } catch (err) {
                    console.error("Rasm faylni o'chirishda xatolik:", err.message);
                }
            }
        }

        const deletedAnime = await animeModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Anime muvaffaqiyatli o'chirildi", deletedAnime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Anime o‘chirishda xatolik yuz berdi" });
    }
};
export const DeletePart = async (req, res) => {
    try {
        const { id, partId } = req.params;

        const currentAnime = await animeModel.findById(id);
        if (!currentAnime) {
            return res.status(404).json({ message: "Anime topilmadi" });
        }

        const partToDelete = currentAnime.parts.find(part => part._id.toString() === partId);
        if (!partToDelete) {
            return res.status(404).json({ message: "Part topilmadi" });
        }

        if (partToDelete.video) {
            try {
                const relativePath = partToDelete.video.startsWith("http")
                    ? new URL(partToDelete.video).pathname.slice(1)
                    : partToDelete.video;

                const fullPath = path.join(process.cwd(), relativePath);
                await fs.unlink(fullPath);
                console.log("Video fayl o'chirildi:", fullPath);
            } catch (err) {
                console.error("Video faylni o'chirishda xatolik:", err.message);
            }
        }

        currentAnime.parts = currentAnime.parts.filter(part => part._id.toString() !== partId);
        await currentAnime.save();

        res.status(200).json({ message: "Qism muvaffaqiyatli o'chirildi" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Qismni o'chirishda xatolik" });
    }
};



export const AddCommentary = async (req, res) => {
    try {
        const { id, text, fullName, imageUrl } = req.body

        const anime = await animeModel.findById(id)

        anime.commentaries.push({
            text: text,
            date: Date.now(),
            user: {
                fullName: fullName,
                imageUrl: imageUrl
            }
        })

        await anime.save()
        res.status(200).json({ message: "Komentariya qo'shildi" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Kamentariya qo'shishda xatolik" });
    }
} 

export const AddLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const anime = await animeModel.findById(id);
        if (!anime) {
            return res.status(404).json({ message: "Anime topilmadi" });
        }

        const alreadyLiked = anime.liked.includes(userId);

        if (alreadyLiked) {
            anime.likes = Math.max(0, anime.likes - 1);
            anime.liked = anime.liked.filter(uid => uid !== userId);

            await anime.save();
            return res.status(200).json({ message: "Like olib tashlandi" });
        } else {
            anime.likes += 1;
            anime.liked.push(userId);

            await anime.save();
            return res.status(200).json({ message: "Like qo'shildi" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Like jarayonida xatolik" });
    }
};