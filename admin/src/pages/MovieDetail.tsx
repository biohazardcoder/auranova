import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Loader from "@/components/ui/loader"
import { Separator } from "@/components/ui/separator"
import { Sheet } from "@/components/ui/sheet"
import { fetcher } from "@/middlewares/Fetcher"
import { MovieProps } from "@/types/RootTypes"
import { useParams } from "react-router-dom"
import useSWR from "swr"
import { AddVideo } from "@/modules/AddVideoToMovie"
import { Button } from "@/components/ui/button"
import { Fetch } from "@/middlewares/Fetch"
import { toast } from "sonner"

export const MovieDetail = () => {
    const { id } = useParams()
    const { data, isLoading, error, mutate } = useSWR(`/movie/${id}`, fetcher)
    const Movies = useSWR("/movie", fetcher)
    const movie = data as MovieProps || {}
    if (isLoading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <Loader />
            </div>
        );
    }

    const handleDeleteMovieVideo = async () => {
        try {
            (await Fetch.delete(`movie/${id}/video`)).data;
            await Movies.mutate()
            await mutate()
            toast.success("Video muvaffaqiyatli o`chirildi")
        } catch (error) {
            console.log(error);
        }
    };

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
                <h1 className="text-2xl font-bold">{movie.title}</h1>
                {
                    !movie.video && <Sheet>
                        <AddVideo id={movie?._id} />
                    </Sheet>
                }
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
            {
                movie.video && <div>
                    <h1 className="text-2xl font-bold mb-4">Video</h1>
                    <video src={movie.video} controls className="w-60 h-40"></video>
                    <Button onClick={handleDeleteMovieVideo} className="mt-2">
                        O'chirish
                    </Button>
                </div>

            }
        </div>
    )
}
