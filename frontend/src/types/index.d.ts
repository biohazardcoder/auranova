export interface PartProps {
    _id: string
    title: string
    season: number
    video: string
    part: number
}

export interface CommentaryProps {
    text: string
    date: string
    user: {
        fullName: string
        imageUrl: string
    }
}

export interface AnimeProps {
    _id: string
    createdAt: string
    title: string
    description: string
    images: string[]
    parts?: PartProps[]
    category: string
    likes: number
    country: string
    studio: string
    made: number
    liked: string[]
    commentaries?: CommentaryProps[]
}

export interface DramaProps {
    _id: string
    createdAt: string
    title: string
    description: string
    images: string[]
    parts?: PartProps[]
    category: string
    likes: number
    liked: string[]
    country: string
    studio: string
    made: number
    commentaries?: CommentaryProps[]
}

export interface CarouselProps {
    _id: string
    url: string,
    background: string
    type: string
}
export interface ItemProps {
    title: string,
    description: string
    image: string
    made: string
    category: string
}


export interface MovieProps {
    _id: string
    createdAt: string
    title: string
    description: string
    images: string[]
    video: string
    category: string
    likes: number
    liked: string[]
    made: number
    studio: string
    country: string
    commentaries?: CommentaryProps[]
}

export interface ContactProps {
    title: string,
    description: string
    email: string
    phone: string
    location: string
}