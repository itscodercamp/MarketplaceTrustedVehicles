
'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { vehicles } from '@/lib/data';
import { formatCurrency, cn } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle, Wrench, Gauge, Users, GitCommitHorizontal, Car, MapPin, Shield, Palette, Sparkles, Armchair, Camera, Image as ImageIcon, FileText, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const inspectionPoints = [
  { category: 'Exterior Angles', points: ['Front view (daylight)', 'Rear view', 'Left side profile', 'Right side profile', 'Front-left 45° angle', 'Front-right 45° angle', 'Rear-left 45° angle', 'Rear-right 45° angle', 'Top-down view', 'Underbody view'] },
  { category: 'Close-ups of Body', points: ['Front grille', 'Headlights (both sides)', 'Fog lamps', 'Tail lights', 'Indicators', 'Bonnet', 'Boot', 'Windshield (front)', 'Rear windshield', 'Wipers'] },
  { category: 'Tyres & Wheels', points: ['Front-left tyre', 'Front-right tyre', 'Rear-left tyre', 'Rear-right tyre', 'Spare tyre', 'Alloy wheels', 'Tyre tread close-up', 'Wheel arches', 'Brake calipers', 'Mud flaps'] },
  { category: 'Pillars & Roof', points: ['A-pillar (driver side)', 'B-pillar (both sides)', 'C-pillar (rear side)', 'Roof (sunroof if any)', 'Roof rails', 'Antenna'] },
  { category: 'Interior – Cabin', points: ['Dashboard full view', 'Instrument cluster (speedometer, odometer)', 'Steering wheel', 'Center console', 'Gear lever', 'AC vents', 'Infotainment system', 'Driver seat', 'Passenger seat', 'Rear seats'] },
  { category: 'Interior – Details', points: ['Seat upholstery close-up', 'Door panels (all 4)', 'Power window controls', 'Interior roof lining', 'Cabin lights', 'Glove box', 'Cup holders', 'Floor mats', 'Pedals (accelerator, brake, clutch)', 'Rear AC vents'] },
  { category: 'Engine & Boot', points: ['Engine bay (full view)', 'Battery close-up', 'Fluid reservoirs (coolant, brake, etc.)', 'Air filter box', 'Boot space (empty)', 'Boot with luggage', 'Tool kit', 'Jack & accessories'] },
  { category: 'Documents & Extras', points: ['RC card/photo', 'Insurance paper', 'Service history file', 'Owner’s manual', 'Extra key', 'Any accessories (camera, dashcam, seat covers)'] }
];

const categoryIcons: { [key: string]: React.ElementType } = {
  Exterior: Camera,
  Interior: Armchair,
  Engine: Wrench,
  Tyres: GitCommitHorizontal,
  Documents: FileText,
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


  const detailItems = [
    { icon: Car, label: "Body Type", value: vehicle.bodyType },
    { icon: MapPin, label: "Registration", value: vehicle.registration },
    { icon: Shield, label: "Insurance", value: vehicle.insurance },
    { icon: Palette, label: "Color", value: vehicle.color },
    { icon: Gauge, label: "Mileage", value: vehicle.mileage },
    { icon: Armchair, label: "Seating", value: `${vehicle.seatingCapacity} Seater`},
    { icon: GitCommitHorizontal, label: "Transmission", value: vehicle.transmission },
    { icon: Sparkles, label: "Engine", value: vehicle.engine },
    { icon: Users, label: "Ownership", value: vehicle.ownership },
    { icon: Wrench, label: "Service History", value: vehicle.serviceHistory },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-video">
          <Image
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="rounded-lg object-cover shadow-lg"
            data-ai-hint={vehicle.imageHint}
          />
           {vehicle.verified && (
            <Badge className="absolute top-4 right-4 bg-success text-success-foreground pointer-events-none">
              <CheckCircle className="w-4 h-4 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
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

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-muted-foreground">KMs Driven</p>
              <p className="font-semibold text-lg">{vehicle.kmsDriven.toLocaleString('en-IN')} km</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-muted-foreground">Fuel Type</p>
              <p className="font-semibold text-lg">{vehicle.fuelType}</p>
            </div>
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-muted-foreground">Condition</p>
              <p className="font-semibold text-lg">{vehicle.condition}</p>
            </div>
          </div>
          
           <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Key Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {detailItems.map(item => (
                  <div key={item.label} className="flex items-start gap-3 bg-muted/50 p-3 rounded-md">
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

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 border-b pb-2">Vehicle Inspection Checklist</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {inspectionPoints.map((section) => (
              <div key={section.category}>
                <h3 className="text-lg font-semibold mb-3 text-primary">{section.category}</h3>
                <ul className="space-y-2 text-sm">
                  {section.points.map((point) => (
                    <li key={point} className="flex items-center">
                       <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
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
