
'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay";
import { getBanners } from '@/lib/services/vehicle-service';
import type { Banner } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdBanner() {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBanners() {
      setLoading(true);
      const fetchedBanners = await getBanners();
      setBanners(fetchedBanners);
      setLoading(false);
    }
    loadBanners();
  }, []);

  if (loading) {
    return (
       <div className="bg-muted">
        <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-2">
            <div className="p-1">
                <Skeleton className="h-[115px] sm:h-[200px] w-full rounded-lg" />
            </div>
        </div>
       </div>
    )
  }

  if (banners.length === 0) {
    return null; // Don't render anything if there are no banners
  }

  return (
    <div className="bg-muted">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-2">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
         className="w-full">
          <CarouselContent>
            {banners.map((banner, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="bg-card border rounded-lg h-[115px] sm:h-[200px] flex items-center justify-center p-0 relative overflow-hidden">
                       <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        priority={index === 0} // Prioritize loading the first banner
                      />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                         <p className="text-white text-center font-bold text-lg drop-shadow-md px-4">
                            {banner.title}
                          </p>
                       </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </div>
  );
}
