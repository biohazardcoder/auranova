import mongoose from "mongoose"

const CarouselSchema = new mongoose.Schema({
    background: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
})

export default mongoose.model("Carousel", CarouselSchema)

