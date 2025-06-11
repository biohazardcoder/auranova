import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Loader from "@/components/ui/loader"
import { Separator } from "@/components/ui/separator"
import { Sheet } from "@/components/ui/sheet"
import { fetcher } from "@/middlewares/Fetcher"
import { DramaProps, PartProps } from "@/types/RootTypes"
import { useParams } from "react-router-dom"
import useSWR from "swr"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Fetch } from "@/middlewares/Fetch"
import { toast } from "sonner"
import { AddDramaPart } from "@/modules/AddDramaPart"

export const DramaDetail = () => {
    const { id } = useParams()
    const { data, isLoading, error, mutate } = useSWR(`/drama/${id}`, fetcher)
    const drama = data as DramaProps || {}
    const handleDeleteDramaPart = async (partId: string) => {
        try {
            (await Fetch.delete(`drama/${id}/part/${partId}`)).data;
            await mutate()
            toast.success("Qism muvaffaqiyatli o`chirildi")
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
                <h1 className="text-2xl font-bold">{drama.title}</h1>
                <Sheet>
                    <AddDramaPart id={drama?._id} />
                </Sheet>
            </div>
            <div className="w-full p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className=" col-span-1 flex items-center justify-center p-4 rounded-md">
                    <Carousel>
                        <CarouselContent>
                            {data?.images?.map((item: string, index: number) => (
                                <CarouselItem key={index}>
                                    <img src={item} alt={index.toString()} className="w-full h-96" />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
                <div className="col-span-1 p-4 space-y-2 rounded-md">
                    <h1 className="text-2xl font-semibold">{data?.title}</h1>
                    <h1 className="text-lg">Malumotlar</h1>
                    <h1 className="text-muted-foreground flex items-center flex-wrap justify-between">Tavsif: <span className="text-blue-500 font-semibold">{data?.description}</span></h1>
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
                </div>
            </div>
            <div>
                <h1 className="text-2xl font-bold mb-4">Qismlar</h1>

                {(() => {
                    const grouped: { [key: number]: PartProps[] } = {};

                    drama.parts?.forEach(part => {
                        if (!grouped[part.season]) {
                            grouped[part.season] = [];
                        }
                        grouped[part.season].push(part);
                    });

                    return Object.entries(grouped)
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([season, parts]) => (
                            <div key={season} className="mb-6">
                                <h2 className="text-xl font-semibold text-sky-500 mb-2">Mavsum {season}</h2>
                                <Table>
                                    <TableCaption>{season} - mavsum  qismlari</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nomi</TableHead>
                                            <TableHead>Mavsum</TableHead>
                                            <TableHead>Qism</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {parts
                                            .sort((a, b) => a.part - b.part)
                                            .map(({ _id, title, part }) => (
                                                <TableRow key={_id}>
                                                    <TableCell className="font-medium">{title}</TableCell>
                                                    <TableCell>{season}</TableCell>
                                                    <TableCell>{part}</TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <EllipsisVertical size={24} className="text-zinc-400" />
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="border-none space-y-1">
                                                                <DropdownMenuItem asChild>
                                                                    <Button className="w-full">
                                                                        <Eye size={20} /> Video
                                                                    </Button>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Button className="w-full">
                                                                        <Pencil size={20} /> Tahrirlash
                                                                    </Button>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild>
                                                                    <Button variant={"destructive"} className="w-full"
                                                                        onClick={() => handleDeleteDramaPart(_id)}
                                                                    >
                                                                        <Trash2 size={20} /> O`chirish
                                                                    </Button>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ));
                })()}
            </div>

        </div>
    )
}
