'use client';
import { useParams } from 'next/navigation';
import { vehicles } from '@/lib/data';
import { formatCurrency, cn } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle, Wrench, Gauge, Users, GitCommitHorizontal, Car, MapPin, Shield, Palette, Sparkles, Armchair } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';

export default function VehicleDetailPage() {
  const { id } = useParams();
  const { isVehicleSaved, toggleSaveVehicle } = useAuth();

  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Vehicle not found</h1>
        <p className="text-muted-foreground">
          The vehicle you are looking for does not exist.
        </p>
      </div>
    );
  }

  const isSaved = isVehicleSaved(vehicle.id);

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
    </div>
  );
}
