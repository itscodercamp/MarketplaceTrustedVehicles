
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getVehicleById, transformVehicleData } from '@/lib/services/vehicle-service';
import type { Vehicle } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import GetBestPrice from '@/components/vehicles/get-best-price';
import {
  Car,
  CheckCircle,
  Calendar,
  Gauge,
  User,
  GitCommit,
  Fuel,
  Wrench,
  Shield,
  Book,
  Palette,
  MapPin,
  Loader2,
  AlertTriangle,
  ServerCrash
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type DetailItem = {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
};

const VehicleDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchVehicle() {
      setLoading(true);
      setError(null);
      try {
        // Trim the ID to remove any leading/trailing spaces
        const trimmedId = id.trim();
        const rawVehicleData = await getVehicleById(trimmedId);
        
        if (!rawVehicleData) {
          throw new Error('VehicleNotFound');
        }
        
        const transformedVehicle = transformVehicleData(rawVehicleData);
        setVehicle(transformedVehicle);

        // Collate all available images, filtering out any undefined or null values
        const images = [
          transformedVehicle.img_front,
          transformedVehicle.img_front_right,
          transformedVehicle.img_right,
          transformedVehicle.img_back_right,
          transformedVehicle.img_back,
          transformedVehicle.img_open_dickey,
          transformedVehicle.img_back_left,
          transformedVehicle.img_left,
          transformedVehicle.img_front_left,
          transformedVehicle.img_open_bonnet,
          transformedVehicle.img_dashboard,
          transformedVehicle.img_right_front_door,
          transformedVehicle.img_right_back_door,
          transformedVehicle.img_engine,
          transformedVehicle.img_roof,
          transformedVehicle.img_odometer,
          transformedVehicle.img_tyre_1,
          transformedVehicle.img_tyre_2,
          transformedVehicle.img_tyre_3,
          transformedVehicle.img_tyre_4,
          transformedVehicle.img_tyre_optional,
        ].filter((img): img is string => !!img && typeof img === 'string');
        
        const uniqueImages = [...new Set(images)];

        setAllImages(uniqueImages);
        setSelectedImage(uniqueImages[0] || null);

      } catch (err: any) {
         if (err.message.includes('404') || err.message === 'VehicleNotFound') {
          setError('VehicleNotFound');
        } else {
          console.error("Fetch Vehicle Error:", err);
          setError(err.message || 'An unexpected error occurred while loading vehicle data.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchVehicle();
  }, [id]);

  if (loading) {
    return <VehicleDetailSkeleton />;
  }

  if (error) {
    if (error === 'VehicleNotFound') {
      return (
        <div className="container mx-auto px-4 py-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <AlertTriangle className="w-24 h-24 text-yellow-500 mb-4" />
          <h1 className="text-3xl font-bold">Vehicle Not Found</h1>
          <p className="text-muted-foreground mt-2">The vehicle you are looking for does not exist or has been removed.</p>
        </div>
      );
    }
    return (
      <div className="container mx-auto px-4 py-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <ServerCrash className="w-24 h-24 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive">Loading Failed</h1>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    );
  }

  if (!vehicle) {
     return null; // Should be covered by error and loading states
  }
  
  const basicDetails: DetailItem[] = [
    { icon: Calendar, label: 'Reg. Year', value: vehicle.regYear },
    { icon: Calendar, label: 'Mfg. Year', value: vehicle.mfgYear },
    { icon: Gauge, label: 'KMs Driven', value: vehicle.kmsDriven ? `${vehicle.kmsDriven.toLocaleString('en-IN')} km` : undefined },
    { icon: User, label: 'Ownership', value: vehicle.ownership },
    { icon: GitCommit, label: 'Reg. Number', value: vehicle.regNumber },
    { icon: MapPin, label: 'RTO', value: vehicle.rtoState },
  ].filter(item => item.value);

  const techDetails: DetailItem[] = [
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType },
    { icon: Wrench, label: 'Transmission', value: vehicle.transmission },
    { icon: Palette, label: 'Color', value: vehicle.color },
    { icon: Shield, label: 'Insurance', value: vehicle.insurance },
    { icon: Book, label: 'Service History', value: vehicle.serviceHistory },
  ].filter(item => item.value);


  return (
    <div className="bg-muted/30">
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Images */}
          <div className="lg:col-span-2">
            <Card className="shadow-md overflow-hidden">
                <CardContent className="p-2">
                    <div className="aspect-[4/3] relative rounded-md overflow-hidden bg-muted">
                        {selectedImage ? (
                        <Image
                            src={selectedImage}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            fill
                            className="object-contain"
                            priority
                            sizes="(max-width: 1024px) 100vw, 66vw"
                        />
                        ) : (
                        <div className="flex items-center justify-center h-full">
                            <Car className="w-24 h-24 text-muted-foreground" />
                        </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {allImages.length > 1 && (
                 <div className="mt-4">
                    <Carousel
                        opts={{
                        align: "start",
                        dragFree: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2">
                        {allImages.map((img, index) => (
                            <CarouselItem key={index} className="pl-2 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
                            <button
                                onClick={() => setSelectedImage(img)}
                                className={cn(
                                "block w-full aspect-square relative rounded-md overflow-hidden border-2 transition-all",
                                selectedImage === img ? 'border-primary' : 'border-transparent hover:border-primary/50'
                                )}
                            >
                                <Image
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="15vw"
                                />
                            </button>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden sm:flex" />
                        <CarouselNext className="hidden sm:flex" />
                    </Carousel>
                </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-1">
             <Card className="shadow-md">
                <CardHeader>
                    <p className="text-sm text-muted-foreground">{vehicle.year} &bull; {vehicle.variant}</p>
                    <CardTitle className="text-2xl sm:text-3xl">{vehicle.make} {vehicle.model}</CardTitle>
                    <div className="flex items-center justify-between pt-2">
                        <p className="text-3xl font-bold text-primary">{formatCurrency(vehicle.price)}</p>
                        {vehicle.verified && (
                        <Badge variant="outline" className="border-success text-success font-medium">
                            <CheckCircle className="mr-1.5 h-4 w-4" />
                            Verified
                        </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <GetBestPrice vehicleId={id.trim()} />
                </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Lower Section: Details & All Images */}
        <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {basicDetails.length > 0 && (
                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Basic Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                            {basicDetails.map(item => <DetailItemCard key={item.label} {...item} />)}
                        </CardContent>
                    </Card>
                )}
                {techDetails.length > 0 && (
                    <Card className="shadow-md">
                        <CardHeader><CardTitle>Technical Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                            {techDetails.map(item => <DetailItemCard key={item.label} {...item} />)}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
        
        {allImages.length > 0 && (
          <div className="mt-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Vehicle Image Gallery</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className="relative aspect-square rounded-lg overflow-hidden border group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <Image
                      src={img}
                      alt={`Vehicle image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
};

function DetailItemCard({ icon: Icon, label, value }: DetailItem) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 p-2 rounded-full">
         <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-semibold text-base leading-tight">{value}</p>
      </div>
    </div>
  );
}


function VehicleDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <div className="flex gap-2 mt-4">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 w-1/5 rounded-md" />)}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  );
}


export default VehicleDetailPage;
