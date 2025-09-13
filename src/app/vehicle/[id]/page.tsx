import Image from 'next/image';
import { vehicles } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Fuel, Gauge, ShieldCheck, Cog, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import SaveVehicleButton from '@/components/vehicles/save-vehicle-button';

const conditionColors = {
  'New': 'bg-green-100 text-green-800 border-green-200',
  'Like New': 'bg-blue-100 text-blue-800 border-blue-200',
  'Good': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Fair': 'bg-orange-100 text-orange-800 border-orange-200',
};

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = vehicles.find(v => v.id === params.id);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-xl shadow-lg">
            <Image
              src={vehicle.imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              width={1200}
              height={800}
              className="object-cover w-full"
              data-ai-hint={vehicle.imageHint}
              priority
            />
            {vehicle.verified && (
              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-primary/80 px-3 py-1.5 text-sm font-semibold text-primary-foreground backdrop-blur-sm">
                <ShieldCheck className="h-5 w-5" />
                <span>Verified by Trusted Vehicles Professional</span>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{vehicle.year} {vehicle.make}</p>
                  <CardTitle className="text-3xl font-headline tracking-tight">{vehicle.model}</CardTitle>
                </div>
                <SaveVehicleButton vehicleId={vehicle.id} />
              </div>
              <p className="text-4xl font-bold text-primary pt-4">{formatCurrency(vehicle.price)}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-muted-foreground">KMs Driven</p>
                      <p className="font-semibold">{vehicle.kmsDriven.toLocaleString('en-IN')} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-muted-foreground">Fuel Type</p>
                      <p className="font-semibold">{vehicle.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-muted-foreground">Manifactured</p>
                      <p className="font-semibold">{vehicle.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cog className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-muted-foreground">Condition</p>
                      <Badge variant="outline" className={`${conditionColors[vehicle.condition]}`}>{vehicle.condition}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />
                
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-5 w-5 text-accent"/>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-semibold">Pune, Maharashtra</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button size="lg" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">Contact Dealer</Button>
                  <Button size="lg" variant="outline" className="flex-1">Test Drive</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
