
'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { vehicles } from '@/lib/data';
import { formatCurrency, cn } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle, Wrench, Gauge, Users, GitCommit, Car, MapPin, Shield, Palette, Sparkles, Armchair, Camera, Image as ImageIcon, FileText, ChevronLeft, ChevronRight, X, Calendar, Fingerprint, Hash, FilePen } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import GetBestPrice from '@/components/vehicles/get-best-price';

const categoryIcons: { [key: string]: React.ElementType } = {
  'Exterior Angles': Camera,
  'Bonnet & Dickey': Car,
  'Pillars & Roof': Car,
  'Interior & Odometer': Armchair,
  'Tyres & Spare': GitCommit,
};

export default function VehicleDetailPage() {
  const { id } = useParams();
  const { isVehicleSaved, toggleSaveVehicle } = useAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Vehicle not found</h1>
        <p className="text-muted-foreground">The vehicle you are looking for does not exist.</p>
      </div>
    );
  }

  const isSaved = isVehicleSaved(vehicle.id);
  
  const allImages = Object.values(vehicle.detailImages).flat();
  
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
    { icon: FilePen, label: "Model", value: `${vehicle.model} ${vehicle.variant}` },
    { icon: Calendar, label: "Reg. Year", value: vehicle.year },
    { icon: Calendar, label: "Mfg. Year", value: vehicle.manufacturingYear },
    { icon: Hash, label: "Reg. Number", value: vehicle.registration },
    { icon: Fingerprint, label: "VIN", value: vehicle.vin },
    { icon: Gauge, label: "Odometer", value: `${vehicle.kmsDriven.toLocaleString('en-IN')} km` },
  ];

  const technicalDetails = [
    { icon: Sparkles, label: "Fuel Type", value: vehicle.fuelType },
    { icon: GitCommit, label: "Transmission", value: vehicle.transmission },
    { icon: MapPin, label: "RTO State", value: vehicle.rtoState },
    { icon: Users, label: "Ownership", value: vehicle.ownership },
    { icon: Shield, label: "Insurance", value: vehicle.insurance },
    { icon: Wrench, label: "Service History", value: vehicle.serviceHistory },
    { icon: Palette, label: "Color", value: vehicle.color },
    { icon: Gauge, label: "Mileage", value: vehicle.mileage },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        
        <div className="lg:col-span-2 relative aspect-video">
          <Image
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="rounded-lg object-cover shadow-lg"
            priority
            data-ai-hint={vehicle.imageHint}
          />
           <div className="absolute top-4 right-4 flex gap-2">
            {vehicle.verified && (
                <Badge className="bg-success text-success-foreground pointer-events-none">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
              )}
               <Badge className={`text-white pointer-events-none ${getStatusBadgeColor()}`}>
                {vehicle.status}
              </Badge>
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
                          <p className="font-semibold">{item.value}</p>
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
                          <p className="font-semibold">{item.value}</p>
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
          {Object.entries(vehicle.detailImages).map(([category, images]) => {
            if (images.length === 0) return null;
            const Icon = categoryIcons[category] || ImageIcon;
            return (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 text-primary flex items-center gap-2">
                  <Icon className="w-5 h-5"/>
                  {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((src, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group" onClick={() => setPreviewImage(src)}>
                      <Image src={src} alt={`${category} image ${index + 1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

       <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-0 flex items-center justify-center">
          {previewImage && (
            <div className="relative w-full h-full">
               <Image src={previewImage} alt="Vehicle preview" fill objectFit="contain" />
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
