import mongoose from "mongoose"

const DramaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [],
    category: { type: String, required: true },
    likes: { type: Number, default: 0 },
    liked: [{ type: String }],
    made: { type: Number, required: true },
    country: { type: String, required: true },
    studio: { type: String, required: true },
    parts: [
        {
            title: { type: String },
            season: { type: Number },
            part: { type: Number },
            video: { type: String }
        }
    ],
    commentaries: [
        {
            text: { type: String },
            date: { type: Date },
            user: {
                fullName: { type: String },
                imageUrl: { type: String },
            }
        }
    ]
}, {
    timestamps: true
})

export default mongoose.model("Drama", DramaSchema)