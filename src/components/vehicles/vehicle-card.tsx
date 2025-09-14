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
import { useToast } from '@/hooks/use-toast';


interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const { isVehicleSaved, toggleSaveVehicle, user } = useAuth();
  const { toast } = useToast();
  const isSaved = user ? isVehicleSaved(vehicle.id) : false;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
       toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You need to be logged in to save vehicles.',
      });
      return;
    }
    toggleSaveVehicle(vehicle.id);
  }

  return (
    <Link href={`/vehicle/${vehicle.id}`} className="block">
      <div className="group relative block overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-lg h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            data-ai-hint={vehicle.imageHint}
          />
        </div>

        <div className="p-3 flex flex-col flex-grow">
          <div className="flex-grow">
            <p className="text-xs text-muted-foreground">{vehicle.year} &bull; {vehicle.kmsDriven.toLocaleString('en-IN')} km</p>
            <h3 className="mt-1 font-semibold leading-tight truncate text-sm">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-8 w-8 shrink-0 rounded-full bg-background/70 hover:bg-background"
            onClick={handleSaveClick}
            aria-label={isSaved ? 'Unsave vehicle' : 'Save vehicle'}
          >
            <Heart className={cn('h-4 w-4', isSaved ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
          </Button>

          <div className="mt-2 flex items-center justify-between">
            <p className="text-base font-bold text-primary">{formatCurrency(vehicle.price)}</p>
            {vehicle.verified && (
              <Badge variant="outline" className="border-success text-success font-medium text-xs px-1.5 py-0.5">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
