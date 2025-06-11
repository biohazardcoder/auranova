import movieModel from "../models/movie-model.js";
import fs from "fs/promises";
import path from "path";

export const GetAllMovies = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const total = await movieModel.countDocuments();
        const movies = await movieModel.find().skip(skip).limit(limit);

        res.status(200).json({
            movies,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Barcha filmlarni olishda xatolik" });
    }
};

export const GetMovieById = async (req, res) => {
    try {
        const { id } = req.params
        const movie = await movieModel.findById(id)
        res.status(200).json(movie)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Id orqali film olishda xatolik" }, error)
    }
}

export const GetMovieByRandom = async (_, res) => {
    try {
        const fourMovies = await movieModel.aggregate([
            { $sample: { size: 4 } }
        ]);

        res.status(200).json(fourMovies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Random filmlar olishda xatolik" });
    }
};

export const GetMoviesByGenre = async (req, res) => {
    try {
        const { value } = req.params;

        const movies = await movieModel.aggregate([
            { $match: { category: value } },
            { $sample: { size: 8 } }
        ]);

        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Janr orqali random filmlar olishda xatolik" });
    }
};


export const CreateMovie = async (req, res) => {
    try {
        const { title, description, category, made, studio, country } = req.body
        const newMovie = await movieModel.create({
            title,
            description,
            images: req.uploadedImages,
            category,
            made,
            studio,
            country
        })
        res.status(200).json(newMovie)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Yangi film yaratishda xatolik" }, error)
    }
}


export const DeleteMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await movieModel.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Film topilmadi" });
        }

        if (movie.images && movie.images.length > 0) {
            for (const imageUrl of movie.images) {
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

        const deletedMovie = await movieModel.findByIdAndDelete(id);

        res.status(200).json({ message: "Film muvaffaqiyatli o'chirildi", deletedMovie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Film o‘chirishda xatolik" });
    }
}

export const AddCommentary = async (req, res) => {
    try {
        const { id, text, fullName, imageUrl } = req.body

        const movie = await movieModel.findById(id)

        movie.commentaries.push({
            text: text,
            date: Date.now(),
            user: {
                fullName: fullName,
                imageUrl: imageUrl
            }
        })

        await movie.save()
        res.status(200).json({ message: "Komentariya qo'shildi" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Kamentariya qo'shishda xatolik" });
    }
}

export const AddVideo = async (req, res) => {
    try {
        const { id } = req.params

        const movie = await movieModel.findById(id)

        movie.video = req.uploadedVideo
        await movie.save()
        res.status(200).json({ message: "Video qo'shildi" });
    } catch (error) {
        console.log(error);

    }
}


export const DeleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = await movieModel.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Movie topilmadi" });
        }


        if (movie.video) {
            try {
                const relativePath = movie.video.startsWith("http")
                    ? new URL(movie.video).pathname.slice(1)
                    : movie.video;

                const fullPath = path.join(process.cwd(), relativePath);
                await fs.unlink(fullPath);
                console.log("Video fayl o'chirildi:", fullPath);
            } catch (err) {
                console.error("Video faylni o'chirishda xatolik:", err.message);
            }
        }
        movie.video = "";
        await movie.save();

        res.status(200).json({ message: "Video o'chirildi" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Video o'chirishda xatolik" });
    }
};


export const AddLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const movie = await movieModel.findById(id);
        if (!movie) {
            return res.status(404).json({ message: "Film topilmadi" });
        }

        const alreadyLiked = movie.liked.includes(userId);

        if (alreadyLiked) {
            movie.likes = Math.max(0, movie.likes - 1);
            movie.liked = movie.liked.filter(uid => uid !== userId);

            await movie.save();
            return res.status(200).json({ message: "Like olib tashlandi" });
        } else {
            movie.likes += 1;
            movie.liked.push(userId);

            await movie.save();
            return res.status(200).json({ message: "Like qo'shildi" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Like jarayonida xatolik" });
    }
};
