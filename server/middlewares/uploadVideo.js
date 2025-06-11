import multer from "multer";
import crypto from "crypto";
import path from "path";

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads/videos");
    },
    filename: (_, file, cb) => {
        const hash = crypto.randomBytes(16).toString("hex");
        const ext = path.extname(file.originalname);
        cb(null, `${hash}${ext}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (_, file, cb) => {
        if (!file.mimetype.startsWith("video/")) {
            return cb(new Error("Faqat video fayllarga ruxsat berilgan!"), false);
        }
        cb(null, true);
    },
});

export default function (req, res, next) {
    upload.single("video")(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        if (req.file) {
            req.uploadedVideo = `${req.protocol}://${req.get("host")}/uploads/videos/${req.file.filename}`;
        }

        next();
    });
}

