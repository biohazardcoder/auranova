import { CarouselProps } from "../types/RootTypes";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import useSWR from "swr"
import { fetcher } from "@/middlewares/Fetcher";
import Loader from "@/components/ui/loader";
import { Fetch } from "@/middlewares/Fetch";
import { toast } from "sonner";
import { AddCarousel } from "@/modules/AddCarousel";


export default function Carousels() {
    const { data, error, isLoading, mutate } = useSWR("/carousel", fetcher)
    const carousels = data || []

    const handleDeleteCarousel = async (id: string) => {
        try {
            (await Fetch.delete(`carousel/${id}`)).data;
            await mutate()
            toast.success("Karusel muvaffaqiyatli o`chirildi!")
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
                <h1 className="text-2xl font-bold">Karusellar</h1>
                <Sheet>
                    <AddCarousel />
                </Sheet>
            </div>

            {carousels?.length <= 0 ? (
                <div className="flex justify-center items-center h-40">
                    <p className="text-lg font-medium text-sky-400">
                        Karusel topilmadi
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {carousels?.map(({ _id, background, type, url }: CarouselProps) => (
                        <div
                            key={_id}
                            className="bg-[#202020] rounded-lg p-4 flex flex-col gap-3 relative"
                        >
                            <Link to={`/${type}/${url}`}>
                                <img src={background} alt={"image"} className="w-full h-40 object-cover object-center" />
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="absolute bottom-[18px] right-3">
                                    <EllipsisVertical size={24} className="text-zinc-400" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="border-none">
                                    <DropdownMenuItem
                                        onClick={() => handleDeleteCarousel(_id)}
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
