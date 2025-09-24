
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import type { Vehicle } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle, Gauge, Fuel, Wrench } from 'lucide-react';
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
  
  const mainImageUrl = vehicle.imageUrl || 'https://picsum.photos/seed/placeholder/600/400';

  return (
    <Link href={`/vehicle/${vehicle.id}`} className="block">
      <div className="group relative block overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-lg h-[100px] sm:h-[135px]">
        <div className="flex h-full">
          <div className="relative w-1/3 flex-shrink-0">
            <Image
              src={mainImageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover rounded-l-lg"
              sizes="25vw"
              data-ai-hint={`${vehicle.color} ${vehicle.make} ${vehicle.model}`}
            />
          </div>

          <div className="flex-grow p-2 sm:p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-semibold leading-tight truncate group-hover:underline">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-xs text-muted-foreground">{vehicle.year} &bull; {vehicle.kmsDriven.toLocaleString('en-IN')} km</p>
              
              <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                {vehicle.fuelType &&
                    <div className="flex items-center gap-1.5">
                        <Fuel className="w-3 h-3" />
                        <span>{vehicle.fuelType}</span>
                    </div>
                }
                 {vehicle.condition &&
                    <div className="flex items-center gap-1.5">
                        <Wrench className="w-3 h-3" />
                        <span>{vehicle.condition}</span>
                    </div>
                }
              </div>
            </div>
            
            <div className="mt-1 flex items-end justify-between">
              <div>
                <p className="text-base sm:text-lg font-bold text-primary">{formatCurrency(vehicle.price)}</p>
                {vehicle.verified && (
                  <Badge variant="outline" className="mt-1 border-success text-success font-medium text-xs px-1.5 py-0.5">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
               <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full bg-background/70 hover:bg-background"
                onClick={handleSaveClick}
                aria-label={isSaved ? 'Unsave vehicle' : 'Save vehicle'}
              >
                <Heart className={cn('h-4 w-4', isSaved ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
