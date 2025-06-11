import CarouselCard from "@/components/mods/carousel";
import { Contact } from "@/components/mods/contact";
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
import { fetcher } from "@/middlewares/Fetcher";
import { CarouselProps } from "@/types";
import { Heart, HeartCrack } from "lucide-react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Autoplay from "embla-carousel-autoplay"



     
export const Home = () => {
  const [wishlistMovies, setWishlistMovies] = useState<any[]>([]);
  const [wishlistAnimes, setWishlistAnimes] = useState<any[]>([]);
  const [wishlistDramas, setWishlistDramas] = useState<any[]>([]);
  
  const AnimeData = useSWR("/anime/random/4", fetcher);
  const animes = AnimeData?.data || [];
  const DramaData = useSWR("/drama/random/4", fetcher);
  const dramas = DramaData?.data || [];
  const CarouselData = useSWR("/carousel", fetcher);
  const carousels = CarouselData.data || [];
  const MovieData = useSWR("/movie/random/4", fetcher);
  const movies = MovieData?.data || [];

  useEffect(() => {
    setWishlistMovies(JSON.parse(localStorage.getItem("wishlist_movies") || "[]"));
    setWishlistAnimes(JSON.parse(localStorage.getItem("wishlist_animes") || "[]"));
    setWishlistDramas(JSON.parse(localStorage.getItem("wishlist_dramas") || "[]"));
  }, []);


const handleLike = (type: "anime" | "movie" | "drama", item: any) => {
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

  if (type === "anime") setWishlistAnimes(updated);
  if (type === "movie") setWishlistMovies(updated);
  if (type === "drama") setWishlistDramas(updated);
};

  const isInWishlist = (type: "anime" | "movie" | "drama", id: string) => {
    if (type === "anime") return wishlistAnimes.some((i) => i._id === id);
    if (type === "movie") return wishlistMovies.some((i) => i._id === id);
    if (type === "drama") return wishlistDramas.some((i) => i._id === id);
    return false;
  };

  return (
    <div>
      <Navbar />

      {CarouselData.isLoading ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader />
        </div>
      ) : carousels.length > 0 ? (
        <div className="w-full min-h-[60vh]">
    <Carousel className="w-full h-full" opts={{ loop: true,  }}  plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}> 
            <CarouselContent>
              {carousels.map((carousel: CarouselProps) => (
                <CarouselCard key={carousel._id} {...carousel} />
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      ) : (
        <h1 className="text-muted-foreground text-sm text-center mt-2">Karusellar mavjud emas</h1>
      )}

      <Section
        title="Filmlar"
        items={movies}
        type="movie"
        handleLike={handleLike}
        isInWishlist={isInWishlist}
      />

      <Section
        title="Animelar"
        items={animes}
        type="anime"
        handleLike={handleLike}
        isInWishlist={isInWishlist}
      />

      <Section
        title="Dramalar"
        items={dramas}
        type="drama"
        handleLike={handleLike}
        isInWishlist={isInWishlist}
      />

      <Contact />
    </div>
  );
};

  const Section = ({
  title,
  items,
  type,
  handleLike,
  isInWishlist,
}: {
  title: string;
  items: any[];
  type: "anime" | "movie" | "drama";
  handleLike: Function;
  isInWishlist: Function;
}) => {
  return (
    <div className="py-4 px-[10%] mt-4">
      <h1 className="font-semibold text-2xl uppercase flex items-center gap-2">
        <span className="w-1 h-8 bg-secondary-foreground" />
        {title}
      </h1>
      {items?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full min-h-[40vh] p-4">
          {items.map(({ images, title, made, _id }) => (
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
                className={`absolute z-10 top-3 right-3`}
                onClick={() => handleLike(type, { images, title, _id, made })}
              >
                {!isInWishlist(type, _id) ? (
                  <Heart />
                ) : (
                  <HeartCrack />
                )}
              </Button>
              <Carousel>
                <CarouselContent>
                  {images?.map((img: string, index: number) => (
                    <CarouselItem key={index}>
                      <Link to={`/${type}/${_id}`}>
                        <img
                          src={img}
                          alt={index.toString()}
                          className="w-full h-80 object-center object-cover"
                        />
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <Link to={`/${type}/${_id}`}>
                <div className="p-2">
                  <h2 className="text-lg font-semibold text-center">{title}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <h1 className="text-muted-foreground text-sm text-center mt-2">
          {title} mavjud emas
        </h1>
      )}
    </div>
  );
};
