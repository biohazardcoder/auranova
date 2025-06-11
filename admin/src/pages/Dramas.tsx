import { DramaProps } from "../types/RootTypes";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Link } from "react-router-dom";
import useSWR from "swr"
import { fetcher } from "@/middlewares/Fetcher";
import Loader from "@/components/ui/loader";
import { Fetch } from "@/middlewares/Fetch";
import { toast } from "sonner";
import { AddDrama } from "@/modules/AddDrama";


export default function Dramas() {
    const { data, error, isLoading, mutate } = useSWR("/drama", fetcher)
    const dramas = data?.dramas || []

    const handleDeleteDrama = async (id: string) => {
        try {
            (await Fetch.delete(`drama/${id}`)).data;
            await mutate()
            toast.success("Drama muvaffaqiyatli o`chirildi!")
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <Loader />
            </div>
        );
    }


    if (error) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-lg font-medium text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">Dramalar</h1>
                <Sheet>
                    <AddDrama />
                </Sheet>
            </div>

            {dramas?.length <= 0 ? (
                <div className="flex justify-center items-center h-40">
                    <p className="text-lg font-medium text-sky-400">
                        Dramalar topilmadi
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {dramas?.map(({ _id, images, title, createdAt }: DramaProps) => (
                        <div
                            key={_id}
                            className="bg-[#202020] rounded-lg p-4 flex flex-col gap-3 relative"
                        >
                            <Carousel>
                                <CarouselContent>
                                    {images.map((item: string, index: number) => (
                                        <CarouselItem key={index}>
                                            <Link to={`/drama/${_id}`}>
                                                <img src={item} alt={index.toString()} className="w-full h-96 object-cover object-center" />
                                            </Link>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>

                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold truncate text-white">
                                    {title}
                                </h2>
                                <p className="text-muted-foreground text-sm pr-5">
                                    {createdAt.slice(0, 10)}
                                </p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="absolute bottom-[18px] right-3">
                                    <EllipsisVertical size={24} className="text-zinc-400" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="border-none">
                                    <DropdownMenuItem
                                        onClick={() => handleDeleteDrama(_id)}
                                        className="flex items-center gap-2 text-red-600 cursor-pointer"
                                    >
                                        <Trash size={20} /> O'chirish
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
