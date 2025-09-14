'use client';
import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import type { Vehicle } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const { isVehicleSaved, toggleSaveVehicle } = useAuth();
  const isSaved = isVehicleSaved(vehicle.id);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveVehicle(vehicle.id);
  }

  return (
    <Link href={`/vehicle/${vehicle.id}`} className="block">
      <div className="group relative block overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            data-ai-hint={vehicle.imageHint}
          />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{vehicle.year} &bull; {vehicle.kmsDriven.toLocaleString('en-IN')} km</p>
              <h3 className="mt-1 font-semibold leading-tight truncate">
                {vehicle.make} {vehicle.model}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 shrink-0 rounded-full bg-background/70 hover:bg-background"
              onClick={handleSaveClick}
              aria-label={isSaved ? 'Unsave vehicle' : 'Save vehicle'}
            >
              <Heart className={cn('h-5 w-5', isSaved ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
            </Button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-bold text-primary">{formatCurrency(vehicle.price)}</p>
            {vehicle.verified && (
              <Badge variant="outline" className="border-success text-success font-medium">
                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                Verified
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
