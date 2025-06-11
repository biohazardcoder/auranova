import { Navbar } from "@/components/mods/navbar"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Loader from "@/components/ui/loader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { fetcher } from "@/middlewares/Fetcher"
import { DramaProps, CommentaryProps, PartProps } from "@/types"
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
export const DramaDetail = () => {
    const { id } = useParams()
    const { user, isSignedIn, isLoaded } = useUser()
    const { data, isLoading, error, mutate } = useSWR<DramaProps>(`/drama/${id}`, fetcher)
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null)
    const [selectedPart, setSelectedPart] = useState<number | null>(null)
    const [text, setText] = useState<string>("")
    const uniqueSeasons = Array.from(
        new Set(data?.parts?.map((item) => item.season))
    )

    const GetDramasByGenre = useSWR(`/drama/genre/${data?.category}`, fetcher)

    const isLikedByUser = data?.liked?.includes(user?.id || ""); 

const [wishlistDramas, setWishlistDramas] = useState<any[]>([]);
    useEffect(() => {
        setWishlistDramas(JSON.parse(localStorage.getItem("wishlist_dramas") || "[]"));
    }, []);

    
     const isInWishlist = (type: "drama", id: string) => {
    if (type === "drama") return wishlistDramas.some((i) => i._id === id);
    return false;
  };
const handleLike = (type: "drama", item: any) => {
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

        if (type === "drama") setWishlistDramas(updated);
    };

    const handleAddCommentary = async () => {
        if (!user && !isSignedIn) {
            return (toast.error("Ro`yxatdan o`ting"))
        }
        try {
            await Fetch.post("/drama/add-commentary", {
                id: id,
                text: text,
                fullName: user?.fullName,
                imageUrl: user?.imageUrl
            })
            setText("")
            await mutate()
            toast.success("Xabar yuborildi")
        } catch (error) {
            console.log(error);

        }
    }

    const handleAddLike = async () => {
        if (!user && !isSignedIn) {
            return toast.error("Ro`yxatdan o`ting");
        }
        try {
            await Fetch.post(`/drama/like/${id}`, { userId: user.id });
            await mutate();
            !isLikedByUser ? toast.success("Like qo'shildi") : toast.warning("Like olindi");
        } catch (error) {
            console.log(error);
        }
    }
    const selectedObject = data?.parts?.find(
        (item) => item.season === selectedSeason && item.part === selectedPart
    )

    const filteredParts =
        selectedSeason !== null
            ? (data?.parts || []).filter((item: PartProps) => item.season === selectedSeason)
            : []

    if (isLoading) {
        return <div>
            <Navbar />
            <div className="w-full h-[90vh] flex items-center justify-center">
                <Loader />
            </div>
        </div>
    }

    if (isLoading) {
        return <div className="w-full h-[90vh] p-4 text-center">
            Xatolik:{error}
        </div>
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
                    <h1 className="text-lg">Malumotlar</h1>
                    <h1 className="text-muted-foreground flex items-center justify-between flex-wrap">Tavsif: <span className="text-blue-500 font-semibold">{data?.description}</span></h1>
                    <Separator />
                    <h1 className="text-muted-foreground flex items-center justify-between">Mamlakat: <span className="text-blue-500 font-semibold">{data?.country}</span></h1>
                    <Separator />
                    <h1 className="text-muted-foreground flex items-center justify-between">Studiya: <span className="text-blue-500 font-semibold">{data?.studio}</span></h1>
                    <Separator />
                    <h1 className="text-muted-foreground flex items-center justify-between">Kategoriya: <span className="text-blue-500 font-semibold">{data?.category}</span></h1>
                    <Separator />
                    <h1 className="text-muted-foreground flex items-center justify-between">Yaratilgan yil: <span className="text-blue-500 font-semibold">{data?.made}</span></h1>
                    <Separator />
                    <h1 className="text-muted-foreground flex items-center justify-between">Layklar: <span className="text-blue-500 font-semibold">{data?.likes}</span></h1>
                    <Separator />
                    <div className="flex justify-end items-center gap-2 mt-6">
                         <Button onClick={() => handleLike("drama", data)}>
                            {!isInWishlist("drama", data?._id|| "") ? (
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
                    <h2 className="text-xl font-semibold">Qismlar</h2>
                    <div className="flex gap-4 flex-wrap">
                        <Select
                            onValueChange={(value) => {
                                setSelectedSeason(Number(value))
                                setSelectedPart(1)
                            }}
                        >
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Mavsum tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    uniqueSeasons.length > 0 ? (
                                        uniqueSeasons.map((season) => (
                                            <SelectItem key={season} value={season.toString()}>
                                                Mavsum {season}
                                            </SelectItem>
                                        ))) : (
                                        <SelectItem value="no">
                                            Mavsum mavjud emas
                                        </SelectItem>
                                    )
                                }
                            </SelectContent>
                        </Select>

                        <Select
                            disabled={selectedSeason === null}
                            onValueChange={(value) => setSelectedPart(Number(value))}
                        >
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Qism tanlang" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    filteredParts.length > 0 ? (
                                        filteredParts.map((item, idx) => (
                                            <SelectItem key={item._id || idx} value={item.part.toString()}>
                                                Qism {item.part}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no">
                                            Qism mavjud emas
                                        </SelectItem>
                                    )
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedObject && (
                        <div className="mt-4 space-y-2 p-4">
                            <p className="text-muted-foreground">
                                Tanlangan qism: <span className="text-white font-semibold">{selectedObject.title}</span> ({selectedObject.season}-mavsum, {selectedObject.part}-qism)
                            </p>
                            <VideoPlayer videoUrl={selectedObject.video} />
                        </div>
                    )}
                </div>
            </div>
            <div className="py-4 w-full px-[5%] ">
                <div className="bg-secondary p-2 rounded-md">
                    <h1 className="text-lg font-semibold mb-2">Kamentariyalar</h1>
                    <Separator className="my-2" />
                    {data?.commentaries && data?.commentaries?.length > 0 ? (
                        <div >
                            {data?.commentaries?.map(({ date, text, user }: CommentaryProps, index: number) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <img src={user?.imageUrl} alt="Logo" className="w-8 h-8 object-center object-cover rounded-full" />
                                        <span>{user.fullName}</span>
                                    </div>
                                    <div>
                                        <h1>Xabar: {text}</h1>
                                        <p className="text-muted-foreground text-sm">Sana: {date.slice(0, 10)}</p>
                                    </div>
                                    <Separator className="my-2" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center my-2">
                            Kammentariya mavjud emas
                        </p>
                    )}
                    <div className="flex items-center gap-2">
                        <Input placeholder="Xabaringizni kiriting" value={text} onChange={(e) => setText(e.target.value)} />
                        {
                            isLoaded && isSignedIn ? <Button onClick={handleAddCommentary}>
                                <Send />
                            </Button> : <Link to={"/sign-in"}>
                                <Button>
                                    <Send />
                                </Button>
                            </Link>
                        }
                    </div>
                </div>
            </div>
            <div className="w-full px-[5%]">
                <div className="rounded-md">
                    <h1 className="text-lg bg-secondary p-2 rounded-md font-semibold mb-2">{data?.category} janriga oid dramalar</h1>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full min-h-[40vh] p-4  px-[7%]">
                        {GetDramasByGenre?.data?.map(({ _id, made, title, images }: DramaProps) => (
                            <div
                                key={_id}
                                className="bg-secondary relative  transition duration-300 ease-in-out"
                            >
                                <div className="w-16 z-10 rounded-md bg-card flex items-center justify-center absolute top-3 left-3 h-8">
                                    {made}
                                </div>
                                <Carousel>
                                    <CarouselContent>
                                        {images?.map((item: string, index: number) => (
                                            <CarouselItem key={index}>
                                                <Link to={`/drama/${_id}`}>
                                                    <img src={item} alt={index.toString()} className="w-full h-80" />
                                                </Link>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                                <Link to={`/drama/${_id}`}>
                                    <div className="p-2">
                                        <h2 className="text-lg font-semibold text-center">{title}</h2>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </div >
    )
}
