import { Navbar } from "@/components/mods/navbar"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Loader from "@/components/ui/loader"
import { Separator } from "@/components/ui/separator"
import { fetcher } from "@/middlewares/Fetcher"
import { MovieProps,  } from "@/types"
import { Heart, HeartCrack, Send, ThumbsDown, ThumbsUp } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import useSWR from "swr"
import { Input } from "@/components/ui/input"
import { Fetch } from "@/middlewares/Axios"
import { useUser } from "@clerk/clerk-react"
import { toast } from "sonner"
import { ScrollToTop } from "@/components/mods/scroll"
import VideoPlayer from "@/components/mods/video-player"
export const MovieDetail = () => {
    const { id } = useParams() 
    const { user, isSignedIn, isLoaded } = useUser() 

    const { data, isLoading, error, mutate } = useSWR<MovieProps>(`/movie/${id}`, fetcher)

    const [text, setText] = useState<string>("") 
    const isLikedByUser = data?.liked?.includes(user?.id || ""); 

    const [wishlistMovies, setWishlistMovies] = useState<any[]>([]);
    useEffect(() => {
        setWishlistMovies(JSON.parse(localStorage.getItem("wishlist_movies") || "[]"));
    }, []);

     const isInWishlist = (type: "movie", id: string) => {
    if (type === "movie") return wishlistMovies.some((i) => i._id === id);
    return false;
  };
    const handleLike = (type: "movie", item: any) => {
        const storageKey = `wishlist_${type}s`;
        const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");

        const alreadyExists = existing.some((i: any) => i._id === item._id);

        let updated;
        if (alreadyExists) {
            updated = existing.filter((i: any) => i._id !== item._id);
    toast.warning(`${item.title} istaklar ro'yxatidan olib tashlandi`);
        } else {
            updated = [...existing, item];
    toast.success(`${item.title} istaklar ro'yxatiga qo'shildi`);
        }

        localStorage.setItem(storageKey, JSON.stringify(updated));

        if (type === "movie") setWishlistMovies(updated);
    };

    const GetMovieByGenre = useSWR(`/movie/genre/${data?.category}`, fetcher)

    const handleAddCommentary = async () => {
        if (!user && !isSignedIn) {
            return toast.error("Ro`yxatdan o`ting");
        }
        try {
            await Fetch.post("/movie/add-commentary", {
                id: id,
                text: text,
                fullName: user?.fullName,
                imageUrl: user?.imageUrl
            });
            setText("");
            await mutate()
            toast.success("Xabar yuborildi");
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddLike = async () => {
        if (!user && !isSignedIn) {
            return toast.error("Ro`yxatdan o`ting");
        }
        try {
            await Fetch.post(`/movie/like/${id}`, { userId: user.id });
            await mutate();
            !isLikedByUser ? toast.success("Like qo'shildi") : toast.warning("Like olindi");
        } catch (error) {
            console.log(error);
        }
    }

    if (isLoading && !isLoaded) {
        return (
            <div>
                <Navbar />
                <div className="w-full h-[90vh] flex items-center justify-center">
                    <Loader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[90vh] p-4 text-center">
                Xatolik: {error.toString()}
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <ScrollToTop />
            <div className="w-full min-h-[110vh] lg:min-h-[60vh]  px-[5%] pt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="bg-secondary col-span-1  rounded-md p-4">
                    <Carousel>
                        <CarouselContent>
                            {data?.images?.map((item: string, index: number) => (
                                <CarouselItem key={index}>
                                    <img src={item} alt={index.toString()} className="w-full h-[470px] object-center object-cover" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>

                <div className="bg-secondary col-span-1 p-4 space-y-2 rounded-md">
                    <h1 className="text-2xl font-semibold">{data?.title}</h1>
                    <h2 className="text-lg">Ma'lumotlar</h2>
                    <p>Tavsif: <span className="text-blue-500 font-semibold">{data?.description}</span></p>
                    <Separator />
                    <p>Mamlakat: <span className="text-blue-500 font-semibold">{data?.country}</span></p>
                    <Separator />
                    <p>Studiya: <span className="text-blue-500 font-semibold">{data?.studio}</span></p>
                    <Separator />
                    <p>Kategoriya: <span className="text-blue-500 font-semibold">{data?.category}</span></p>
                    <Separator />
                    <p>Yaratilgan yil: <span className="text-blue-500 font-semibold">{data?.made}</span></p>
                    <Separator />
                    <p>Layklar: <span className="text-blue-500 font-semibold">{data?.likes}</span></p>
                    <Separator />
                    <div className="flex justify-end items-center gap-2 mt-6">
                        <Button onClick={() => handleLike("movie", data)}>
                            {!isInWishlist("movie", data?._id|| "") ? (
                                <Heart />
                            ) : (
                                <HeartCrack />
                            )}
                        </Button>
                        <Button onClick={handleAddLike} variant="outline">
                            {isLikedByUser ? (
                                <ThumbsDown className="text-red-500" />
                            ) : (
                                <ThumbsUp className="text-green-500" />
                            )}
                        </Button>
                    </div>
                </div>

                <div className="bg-secondary col-span-1 lg:col-span-2 p-4 space-y-4 rounded-md">
                    {data?.video ? (
                        <VideoPlayer videoUrl={data.video} />
                    ) : (
                        <h1 className="text-muted-foreground text-sm text-center mt-2">Video mavjud emas</h1>
                    )}
                </div>
            </div>

            <div className="py-4 w-full px-[5%] ">
                <div className="bg-secondary p-2 rounded-md">
                    <h2 className="text-lg font-semibold mb-2">Kommentariyalar</h2>
                    <Separator className="my-2" />
                    {data?.commentaries?.length ? (
                        data.commentaries.map(({ date, text, user }, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <img src={user?.imageUrl} alt="user" className="w-8 h-8 rounded-full object-cover" />
                                    <span>{user.fullName}</span>
                                </div>
                                <p>Xabar: {text}</p>
                                <p className="text-muted-foreground text-sm">Sana: {date.slice(0, 10)}</p>
                                <Separator className="my-2" />
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center my-2">Kommentariya mavjud emas</p>
                    )}
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Xabaringizni kiriting"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        {isLoaded && isSignedIn ? (
                            <Button onClick={handleAddCommentary}>
                                <Send />
                            </Button>
                        ) : (
                            <Link to="/sign-in">
                                <Button>
                                    <Send />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full px-[5%]">
                <div className="rounded-md">
                    <h2 className="text-lg bg-secondary p-2 rounded-md font-semibold mb-2">{data?.category} janriga oid filmlar</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full min-h-[40vh] p-4 px-[7%]">
                        {GetMovieByGenre?.data?.map(({ _id, made, title, images }:MovieProps) => (
                            <li key={_id} className="bg-secondary relative transition duration-300 ease-in-out rounded-md overflow-hidden">
                                <div className="w-16 z-10 rounded-md bg-card flex items-center justify-center absolute top-3 left-3 h-8">
                                    {made}
                                </div>
                                <Carousel>
                                    <CarouselContent>
                                        {images?.map((img, idx) => (
                                            <CarouselItem key={idx}>
                                                <Link to={`/movie/${_id}`}>
                                                    <img src={img} alt={`movie-${idx}`} className="w-full h-80 object-cover" />
                                                </Link>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                                <Link to={`/drama/${_id}`}>
                                    <div className="p-2">
                                        <h3 className="text-lg font-semibold text-center">{title}</h3>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
