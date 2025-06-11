
export interface AdminTypes {
  createdAt: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface ContactTypes {
  createdAt: string;
  name: string;
  email: string;
  message: string;
  updatedAt: string;
  __v: number;
  _id: string;
}


export interface CarouselTypes {
  createdAt: string;
  title: string;
  description: string;
  images: string[];
  link: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

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
  user: string
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
  made: number
  studio: string
  country: string
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
  made: number
  studio: string
  country: string
  commentaries?: CommentaryProps[]
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
  made: number
  studio: string
  country: string
  commentaries?: CommentaryProps[]
}

export interface CarouselProps {
  _id: string
  url: string,
  background: string
  type: string
}


