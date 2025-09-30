
'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getVehicleById } from '@/lib/services/vehicle-service';
import { transformVehicleData } from '@/lib/services/vehicle-service'; // Import the transformer
import type { Vehicle } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle, Wrench, Gauge, Users, Car, MapPin, Shield, Palette, Sparkles, Armchair, Camera, Image as ImageIcon, ChevronLeft, ChevronRight, X, Calendar, Hash, FilePen, DoorOpen, HardHat, Cog, GitCommit } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import GetBestPrice from '@/components/vehicles/get-best-price';
import { Skeleton } from '@/components/ui/skeleton';


// Define a type for our structured image gallery
type ImageGallerySection = {
  title: string;
  icon: React.ElementType;
  images: { url?: string; label: string }[];
};

const VehicleDetailSkeleton = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
                <Skeleton className="aspect-video rounded-lg" />
            </div>
            <div className="lg:col-span-1 space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
        <div className="mt-12 space-y-8">
            <Skeleton className="h-8 w-1/4" />
            <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
        <div className="mt-12 space-y-8">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-64 w-full" />
        </div>
    </div>
);


export default function VehicleDetailPage() {
  const { id } = useParams();
  const { isVehicleSaved, toggleSaveVehicle } = useAuth();
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof id === 'string') {
      const fetchVehicle = async () => {
        setLoading(true);
        const rawVehicleData = await getVehicleById(id);
        if (rawVehicleData) {
          // *** THE FIX: Transform the raw API data before setting the state ***
          const transformedVehicle = transformVehicleData(rawVehicleData);
          setVehicle(transformedVehicle);
        } else {
          setVehicle(null);
        }
        setLoading(false);
      };
      fetchVehicle();
    }
  }, [id]);

  if (loading) {
    return <VehicleDetailSkeleton />;
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Vehicle not found</h1>
        <p className="text-muted-foreground">The vehicle you are looking for does not exist.</p>
      </div>
    );
  }
  
  // --- Start of new dynamic image gallery and details logic ---

  const imageGallery: ImageGallerySection[] = [
    { 
      title: 'Exterior Angles', 
      icon: Camera,
      images: [
        { url: vehicle.img_front, label: 'Front' },
        { url: vehicle.img_back, label: 'Back' },
        { url: vehicle.img_left, label: 'Left' },
        { url: vehicle.img_right, label: 'Right' },
        { url: vehicle.img_front_left, label: 'Front-Left' },
        { url: vehicle.img_front_right, label: 'Front-Right' },
        { url: vehicle.img_back_left, label: 'Back-Left' },
        { url: vehicle.img_back_right, label: 'Back-Right' },
      ],
    },
    {
      title: 'Doors, Bonnet & Dickey',
      icon: DoorOpen,
      images: [
        { url: vehicle.img_open_bonnet, label: 'Bonnet Open' },
        { url: vehicle.img_open_dickey, label: 'Dickey (Trunk) Open' },
        { url: vehicle.img_right_front_door, label: 'Right Front Door Open' },
        { url: vehicle.img_right_back_door, label: 'Right Back Door Open' },
      ],
    },
    {
      title: 'Roof & Pillars',
      icon: HardHat,
      images: [
        { url: vehicle.img_roof, label: 'Roof' },
      ],
    },
    {
      title: 'Interior & Odometer',
      icon: Armchair,
      images: [
        { url: vehicle.img_dashboard, label: 'Dashboard View' },
        { url: vehicle.img_odometer, label: 'Odometer' },
      ],
    },
    {
      title: 'Tyres',
      icon: GitCommit,
      images: [
        { url: vehicle.img_tyre_1, label: 'Tyre 1' },
        { url: vehicle.img_tyre_2, label: 'Tyre 2' },
        { url: vehicle.img_tyre_3, label: 'Tyre 3' },
        { url: vehicle.img_tyre_4, label: 'Tyre 4' },
        { url: vehicle.img_tyre_optional, label: 'Spare Tyre' },
      ],
    },
     {
      title: 'Engine',
      icon: Cog,
      images: [
        { url: vehicle.img_engine, label: 'Engine Bay' },
      ],
    },
  ].map(section => ({
      ...section,
      images: section.images.filter(img => img.url) // Filter out images that don't exist
  })).filter(section => section.images.length > 0); // Filter out sections with no images

  const allImages = imageGallery.flatMap(section => section.images.map(img => img.url!));
  
  const handleNextPreview = () => {
    if (!previewImage) return;
    const currentIndex = allImages.indexOf(previewImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setPreviewImage(allImages[nextIndex]);
  };

  const handlePrevPreview = () => {
    if (!previewImage) return;
    const currentIndex = allImages.indexOf(previewImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setPreviewImage(allImages[prevIndex]);
  };

  const isSaved = isVehicleSaved(vehicle.id);
  
  const getStatusBadgeColor = () => {
    switch (vehicle.status) {
      case 'For Sale': return 'bg-green-500 hover:bg-green-600';
      case 'Sold': return 'bg-red-500 hover:bg-red-600';
      case 'Reserved': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-muted-foreground';
    }
  }

  const basicDetails = [
    { icon: Car, label: "Make", value: vehicle.make },
    { icon: FilePen, label: "Model", value: `${vehicle.model} ${vehicle.variant || ''}` },
    { icon: Calendar, label: "Reg. Year", value: vehicle.regYear },
    { icon: Calendar, label: "Mfg. Year", value: vehicle.mfgYear },
    { icon: Hash, label: "Reg. Number", value: vehicle.regNumber },
    { icon: Gauge, label: "Odometer", value: `${vehicle.kmsDriven?.toLocaleString('en-IN')} km` },
  ].filter(item => item.value);

  const technicalDetails = [
    { icon: Sparkles, label: "Fuel Type", value: vehicle.fuelType },
    { icon: GitCommit, label: "Transmission", value: vehicle.transmission },
    { icon: MapPin, label: "RTO State", value: vehicle.rtoState },
    { icon: Users, label: "Ownership", value: vehicle.ownership },
    { icon: Shield, label: "Insurance", value: vehicle.insurance },
    { icon: Wrench, label: "Service History", value: vehicle.serviceHistory },
    { icon: Palette, label: "Color", value: vehicle.color },
    { icon: Gauge, label: "Mileage", value: 'N/A' },
  ].filter(item => item.value);
  
  const mainImageUrl = vehicle.imageUrl || vehicle.img_front || 'https://picsum.photos/seed/placeholder/1200/800';

  // --- End of new dynamic image gallery and details logic ---

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        
        <div className="lg:col-span-2 relative aspect-video">
          <Image
            src={mainImageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="rounded-lg object-cover shadow-lg"
            priority
            data-ai-hint={`${vehicle.color} ${vehicle.make} ${vehicle.model}`}
          />
           <div className="absolute top-4 right-4 flex gap-2">
            {vehicle.verified && (
                <Badge className="bg-success text-success-foreground pointer-events-none">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
              )}
              {vehicle.status && (
                <Badge className={`text-white pointer-events-none ${getStatusBadgeColor()}`}>
                    {vehicle.status}
                </Badge>
              )}
           </div>
        </div>

        <div className="lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-muted-foreground text-lg">{vehicle.variant}</p>
              <p className="text-2xl font-semibold text-primary mt-2">
                {formatCurrency(vehicle.price)}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleSaveVehicle(vehicle.id)}
              aria-label={isSaved ? 'Unsave vehicle' : 'Save vehicle'}
            >
              <Heart className={cn('h-5 w-5', isSaved ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
            </Button>
          </div>

          <div className="mt-6 border-t pt-6">
             <GetBestPrice vehicleId={vehicle.id} />
           </div>
        </div>
      </div>
      
       <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary border-b pb-2">Basic Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                {basicDetails.map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                      <item.icon className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                          <p className="text-muted-foreground">{item.label}</p>
                          <p className="font-semibold">{String(item.value)}</p>
                      </div>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary border-b pb-2">Technical & Other Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
                {technicalDetails.map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                      <item.icon className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                          <p className="text-muted-foreground">{item.label}</p>
                          <p className="font-semibold">{String(item.value)}</p>
                      </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
       </div>

       <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2 flex items-center gap-2">
          <ImageIcon className="w-6 h-6" />
          Vehicle Gallery
        </h2>
        <div className="space-y-8">
          {imageGallery.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
                  <section.icon className="w-5 h-5"/>
                  {section.title}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {section.images.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group" onClick={() => setPreviewImage(image.url!)}>
                      <Image src={image.url!} alt={`${section.title} - ${image.label}`} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-black/40 flex items-end justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs text-center">{image.label}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
          ))}
        </div>
      </div>

       <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-0 flex items-center justify-center">
          {previewImage && (
            <div className="relative w-full h-full">
               <Image src={previewImage} alt="Vehicle preview" layout="fill" objectFit="contain" />
               <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white" onClick={() => setPreviewImage(null)}>
                  <X className="w-6 h-6"/>
               </Button>
                <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white" onClick={handlePrevPreview}>
                  <ChevronLeft className="w-8 h-8"/>
                </Button>
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/70 text-white" onClick={handleNextPreview}>
                  <ChevronRight className="w-8 h-8"/>
               </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

    

    

    