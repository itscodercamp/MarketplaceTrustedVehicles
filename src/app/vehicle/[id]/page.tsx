'use client';
import { useParams } from 'next/navigation';
import { vehicles } from '@/lib/data';
import { formatCurrency, cn } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle } from 'lucide-react';
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

  return (
    <div className="container mx-auto px-4 py-8">
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

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
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
             <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-muted-foreground">Verification</p>
              <p className="font-semibold text-lg flex items-center">
                {vehicle.verified ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1.5 text-success" /> Verified by Trusted Vehicle
                  </>
                ) : 'Not Verified'}
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Condition Report</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
                <p>Detailed condition report coming soon. This section will contain an AI-generated analysis of the vehicle's condition based on images and user descriptions.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
