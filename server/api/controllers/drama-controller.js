import dramaModel from "../models/drama-model.js";
import fs from "fs/promises";
import path from "path";

export const GetAllDramas = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const total = await dramaModel.countDocuments();
        const dramas = await dramaModel.find().skip(skip).limit(limit);

        res.status(200).json({
            dramas,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in get all dramas" });
    }
};

export const GetDramaById = async (req, res) => {
    try {
        const { id } = req.params
        const drama = await dramaModel.findById(id)
        res.status(200).json(drama)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in get drama by id" }, error)
    }
}

export const GetDramasByRandom = async (_, res) => {
    try {
        const fourDramas = await dramaModel.aggregate([
            { $sample: { size: 4 } }
        ]);

        res.status(200).json(fourDramas);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in get dramas by random" });
    }
};

export const GetDramasByGenre = async (req, res) => {
    try {
        const { value } = req.params;

        const dramas = await dramaModel.aggregate([
            { $match: { category: value } },
            { $sample: { size: 8 } }
        ]);

        res.status(200).json(dramas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Janr orqali random dramalar olishda xatolik" });
    }
};


export const CreateDrama = async (req, res) => {
    try {
        const { title, description, category, made, studio, country } = req.body
        const newDrama = await dramaModel.create({
            title,
            description,
            images: req.uploadedImages,
            category,
            made,
            studio,
            country
        })
        res.status(200).json(newDrama)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in create new drama" }, error)
    }
}

export const CreatePart = async (req, res) => {
    try {
        const { title, season, part, drama } = req.body;
        const newPart = {
            title,
            season,
            part,
            video: req.uploadedVideo
        };

        const currentDrama = await dramaModel.findById(drama);

        if (!currentDrama) {
            return res.status(404).json({ message: "Drama topilmadi" });
        }

        currentDrama.parts.push(newPart);
        await currentDrama.save();

        res.status(200).json(newPart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Yangi qism yaratishda xatolik" });
    }
};

export const DeleteDrama = async (req, res) => {
    try {
        const { id } = req.params;
        const drama = await dramaModel.findById(id);
        if (!drama) {
            return res.status(404).json({ message: "Drama topilmadi" });
        }

        if (drama.images && drama.images.length > 0) {
            for (const imageUrl of drama.images) {
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

        await dramaModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Drama muvaffaqiyatli o'chirildi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Drama o‘chirishda xatolik yuz berdi" });
    }
};


export const DeletePart = async (req, res) => {
    try {
        const { id, partId } = req.params;
        const currentDrama = await dramaModel.findById(id);
        if (!currentDrama) {
            return res.status(404).json({ message: "Drama topilmadi" });
        }

        const partToDelete = currentDrama.parts.find(part => part._id.toString() === partId);

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

        currentDrama.parts = currentDrama.parts.filter(part => part._id.toString() !== partId);
        await currentDrama.save();

        res.status(200).json({ message: "Qism muvaffaqiyatli o'chirildi" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Qismni o'chirishda xatolik" });
    }
};



export const AddCommentary = async (req, res) => {
    try {
        const { id, text, fullName, imageUrl } = req.body

        const drama = await dramaModel.findById(id)

        drama.commentaries.push({
            text: text,
            date: Date.now(),
            user: {
                fullName: fullName,
                imageUrl: imageUrl
            }
        })

        await drama.save()
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

        const drama = await dramaModel.findById(id);
        if (!drama) {
            return res.status(404).json({ message: "Drama topilmadi" });
        }

        const alreadyLiked = drama.liked.includes(userId);

        if (alreadyLiked) {
            drama.likes = Math.max(0, drama.likes - 1);
            drama.liked = drama.liked.filter(uid => uid !== userId);

            await drama.save();
            return res.status(200).json({ message: "Like olib tashlandi" });
        } else {
            drama.likes += 1;
            drama.liked.push(userId);

            await drama.save();
            return res.status(200).json({ message: "Like qo'shildi" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Like jarayonida xatolik" });
    }
};