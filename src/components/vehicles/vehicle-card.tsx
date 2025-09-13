import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Fuel, Gauge, ShieldCheck, Cog } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Vehicle } from '@/lib/types';
import Link from 'next/link';
import SaveVehicleButton from './save-vehicle-button';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const conditionColors = {
  'New': 'bg-green-100 text-green-800 border-green-200',
  'Like New': 'bg-blue-100 text-blue-800 border-blue-200',
  'Good': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Fair': 'bg-orange-100 text-orange-800 border-orange-200',
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <CardHeader className="p-0 relative">
        <Image
          src={vehicle.imageUrl}
          alt={`${vehicle.make} ${vehicle.model}`}
          width={600}
          height={400}
          className="object-cover w-full h-48"
          data-ai-hint={vehicle.imageHint}
        />
        {vehicle.verified && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-primary/80 px-2 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Verified</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-headline">
              <Link href={`/vehicle/${vehicle.id}`} className="hover:text-primary">
                {vehicle.make} {vehicle.model}
              </Link>
            </CardTitle>
            <SaveVehicleButton vehicleId={vehicle.id} />
        </div>
        <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(vehicle.price)}</p>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-accent" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-accent" />
            <span>{vehicle.kmsDriven.toLocaleString('en-IN')} kms</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-accent" />
            <span>{vehicle.fuelType}</span>
          </div>
           <div className="flex items-center gap-2">
            <Cog className="h-4 w-4 text-accent" />
             <Badge variant="outline" className={`${conditionColors[vehicle.condition]}`}>{vehicle.condition}</Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/30">
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href={`/vehicle/${vehicle.id}`}>
                View Details
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
