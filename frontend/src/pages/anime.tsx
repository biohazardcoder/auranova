import { Navbar } from "@/components/mods/navbar";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Loader from "@/components/ui/loader";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import useSWR from "swr";
import { useState } from "react";
import { fetcher } from "@/middlewares/Fetcher";
import { AnimeProps } from "@/types";


export const Anime = () => {
    const [page, setPage] = useState(1);
    const limit = 8;

    const { data, isLoading, error } = useSWR(`/anime?page=${page}&limit=${limit}`, fetcher);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= data?.totalPages) {
            setPage(newPage);
        }
    };

    if (error) {
        return <h1 className="text-center text-destructive">Xatolik yuz berdi</h1>;
    }

    return (
        <div>
            <Navbar />
            <div className="w-full min-h-[90vh]">
                <div className="py-4 px-[5%]">
                    <h1 className="font-semibold text-2xl uppercase flex items-center gap-2">
                        <span className="w-1 h-8 bg-secondary-foreground" />
                        Animelar
                    </h1>

                    {isLoading || !data ? (
                        <div className="flex justify-center mt-10">
                            <Loader />
                        </div>
                    ) : data.animes.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full min-h-[40vh] p-4">
                                {data.animes.map(({ images, title, made, _id }: AnimeProps) => (
                                    <div
                                        key={_id}
                                        className="bg-secondary relative transition duration-300 ease-in-out"
                                    >
                                        <div className="w-16 z-10 rounded-md bg-card flex items-center justify-center absolute top-3 left-3 h-8">
                                            {made}
                                        </div>
                                        <Button
                                            size={"icon"}
                                            variant={"secondary"}
                                            className="absolute z-10 top-3 right-3"
                                        >
                                            <Heart />
                                        </Button>
                                        <Carousel>
                                            <CarouselContent>
                                                {images?.map((item: string, index: number) => (
                                                    <CarouselItem key={index}>
                                                        <Link to={`/anime/${_id}`}>
                                                            <img
                                                                src={item}
                                                                alt={index.toString()}
                                                                className="w-full h-80"
                                                            />
                                                        </Link>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </Carousel>
                                        <Link to={`/anime/${_id}`}>
                                            <div className="p-2">
                                                <h2 className="text-lg font-semibold text-center">{title}</h2>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center mt-6">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(page - 1)}
                                                className={page === 1 ? "opacity-50 pointer-events-none" : ""}
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: data.totalPages }).map((_, index) => {
                                            const pageNum = index + 1;
                                            return (
                                                <PaginationItem key={pageNum}>
                                                    <PaginationLink
                                                        isActive={pageNum === page}
                                                        onClick={() => handlePageChange(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(page + 1)}
                                                className={page === data.totalPages ? "opacity-50 pointer-events-none" : ""}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </>
                    ) : (
                        <div className="text-center mt-10">Animelar topilmadi</div>
                    )}
                </div>
            </div>
        </div>
    );
};
