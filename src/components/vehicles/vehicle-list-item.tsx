'use client';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import type { Vehicle } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle, Car, Gauge, Fuel, Wrench } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { cn } from '@/lib/utils';

interface VehicleListItemProps {
  vehicle: Vehicle;
}

export default function VehicleListItem({ vehicle }: VehicleListItemProps) {
  const { isVehicleSaved, toggleSaveVehicle } = useAuth();
  const isSaved = isVehicleSaved(vehicle.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveVehicle(vehicle.id);
  };

  return (
    <Link href={`/vehicle/${vehicle.id}`} className="block">
      <div className="group relative block overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-lg">
        <div className="flex flex-col sm:flex-row">
          <div className="relative aspect-[4/3] sm:w-1/4 sm:flex-shrink-0">
            <Image
              src={vehicle.imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover sm:rounded-l-lg sm:rounded-r-none"
              sizes="(max-width: 640px) 100vw, 25vw"
              data-ai-hint={vehicle.imageHint}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 shrink-0 rounded-full bg-background/70 hover:bg-background sm:hidden"
              onClick={handleSaveClick}
              aria-label={isSaved ? 'Unsave vehicle' : 'Save vehicle'}
            >
              <Heart className={cn('h-5 w-5', isSaved ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
            </Button>
          </div>

          <div className="flex-grow p-4 flex flex-col sm:flex-row sm:items-center">
            <div className="flex-grow">
              <h3 className="text-lg font-semibold leading-tight truncate group-hover:underline">
                {vehicle.make} {vehicle.model}
              </h3>
               <p className="text-sm text-muted-foreground">{vehicle.year}</p>

              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Gauge className="w-4 h-4" />
                    <span>{vehicle.kmsDriven.toLocaleString('en-IN')} km</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Fuel className="w-4 h-4" />
                    <span>{vehicle.fuelType}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Wrench className="w-4 h-4" />
                    <span>{vehicle.condition}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-0 sm:ml-4 sm:w-1/4 flex flex-col items-start sm:items-end justify-between shrink-0">
              <p className="text-xl font-bold text-primary">{formatCurrency(vehicle.price)}</p>
               {vehicle.verified && (
                <Badge variant="outline" className="mt-2 border-success text-success font-medium">
                  <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                  Verified
                </Badge>
              )}
               <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex h-8 w-8 shrink-0 rounded-full bg-background/70 hover:bg-background mt-2"
                onClick={handleSaveClick}
                aria-label={isSaved ? 'Unsave vehicle' : 'Save vehicle'}
              >
                <Heart className={cn('h-5 w-5', isSaved ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
