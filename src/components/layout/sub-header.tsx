'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, MapPin } from 'lucide-react';
import { useVehicleFilterStore } from '@/store/vehicle-filters';
import { useLocationStore } from '@/store/location-store';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function SubHeader() {
  const {
    filters: { vehicleType },
    setVehicleType,
  } = useVehicleFilterStore();
  
  const { hasLocationAccess, requestLocation } = useLocationStore();

  useEffect(() => {
    // Request location once on component mount
    requestLocation();
  }, [requestLocation]);

  return (
    <div className="sticky top-16 z-40 border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-auto min-h-12 items-center justify-between px-2 sm:px-6 lg:px-8 py-1">
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 sm:gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-7 px-1 text-xs sm:h-8 sm:px-2 sm:text-sm font-medium"
              >
                {vehicleType === '4-wheeler' ? '4-Wheeler' : '2-Wheeler'}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setVehicleType('4-wheeler')}>
                4-Wheeler
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                2-Wheeler (Coming Soon)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 sm:gap-x-2">
            <Button
              asChild
              variant="link"
              className="h-7 px-1 text-xs sm:h-8 sm:px-2 sm:text-sm font-medium text-muted-foreground"
            >
              <Link href="/profile">My Favourites</Link>
            </Button>
            <Button
              variant="link"
              className="h-7 px-1 text-xs sm:h-8 sm:px-2 sm:text-sm font-medium text-muted-foreground"
            >
              Start Selling
            </Button>
            <Button
              variant="link"
              className="h-7 px-1 text-xs sm:h-8 sm:px-2 sm:text-sm font-medium text-muted-foreground"
            >
              FAQ
            </Button>
            <Button
              variant="link"
              className="h-7 px-1 text-xs sm:h-8 sm:px-2 sm:text-sm font-medium text-muted-foreground"
            >
              Support
            </Button>
          </div>
        </div>
         <Button onClick={requestLocation} variant="ghost" size="icon" className="h-8 w-8">
            <MapPin className={cn("h-5 w-5", hasLocationAccess ? 'text-green-500' : 'text-muted-foreground')} />
            <span className="sr-only">Detect Location</span>
          </Button>
      </div>
    </div>
  );
}
