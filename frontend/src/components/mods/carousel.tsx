import useSWR from 'swr';
import { Link } from 'react-router-dom';
import { CarouselItem } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { CarouselProps, ItemProps } from '@/types';
import { fetcher } from '@/middlewares/Fetcher';
import Loader from '../ui/loader';
import { Eye } from 'lucide-react';


const CarouselCard = ({ background, type, url, _id }: CarouselProps) => {
    const { data, isLoading } = useSWR(`/${type}/${url}`, fetcher);
    const image = data?.images?.[0] || '/fallback.jpg';
    const item = data as ItemProps || {}

    return (
        <CarouselItem key={_id}>
            <div
                className="bg-cover w-full relative bg-center min-h-[60vh] p-4  flex flex-wrap gap-4 items-center justify-center"
                style={{ backgroundImage: `url(${background})` }}
            >
                <div className="bg-[#0000008c] w-full h-full absolute top-0 left-0" />
                <div className="z-10 p-10">
                    {isLoading ? (
                        <div className="flex min-h-[50vh] items-center justify-center">
                            <Loader />
                        </div>
                    ) : (
                        <img src={image} alt="image" className="w-[300px] h-96 rounded-md" />
                    )}
                </div>
                <div className="z-10 space-y-3 text-white">
                    <h1 className='text-4xl font-semibold'>
                        PREMYERA
                    </h1>
                    <div className='flex items-center gap-2'>
                        <mark className='px-1  text-lg'>{item.made}</mark>
                        <mark className='px-1  text-lg'>{item.category}</mark>
                    </div>
                    <h1 className="text-3xl font-semibold">{item.title}   </h1>
                    <p className="max-w-[360px] text-lg">{item.description}</p>
                    <Link to={`/${type}/${url}`}>
                        <Button className="w-full mt-2">
                            <Eye />    Ko'rish
                        </Button>
                    </Link>
                </div>
            </div>
        </CarouselItem>
    );
};

export default CarouselCard;
