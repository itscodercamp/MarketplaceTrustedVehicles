'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function AdBanner() {
  const adImages = [
    { seed: 'ad1', hint: 'car discount' },
    { seed: 'ad2', hint: 'motorcycle sale' },
    { seed: 'ad3', hint: 'car loan' },
    { seed: 'ad4', hint: 'vehicle insurance' },
  ]
  return (
    <div className="bg-muted">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-2">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
         className="w-full">
          <CarouselContent>
            {adImages.map((ad, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="bg-card border rounded-lg h-[115px] sm:h-[200px] flex items-center justify-center p-0 relative overflow-hidden">
                       <Image
                        src={`https://picsum.photos/seed/${ad.seed}/1200/400`}
                        alt={`Advertisement ${index + 1}`}
                        fill
                        className="object-cover"
                        data-ai-hint={ad.hint}
                      />
                       <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                         <p className="text-white text-center font-bold text-lg drop-shadow-md">
                            Ad Banner {index + 1}
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
