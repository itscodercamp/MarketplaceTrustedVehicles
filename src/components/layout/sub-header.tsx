
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
import { useAuth } from '@/context/auth-provider';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function SubHeader() {
  const {
    filters: { vehicleType },
    setVehicleType,
  } = useVehicleFilterStore();
  
  const { hasLocationAccess, requestLocation, _hasHydrated } = useLocationStore();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    // Once the store is hydrated, request location if we don't have it
    if (_hasHydrated) {
      requestLocation();
    }
  }, [_hasHydrated, requestLocation]);

  const handleStartSellingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/start-selling');
  };
  
  const handleMyFavouritesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setTimeout(() => {
        toast({
          variant: 'warning',
          title: 'Authentication Required',
          description: 'Please log in to view your favourites.',
        });
      }, 0);
      router.push('/login?redirect=/profile');
    } else {
      router.push('/profile');
    }
  };

  const showSubHeader = pathname === '/';

  if (!showSubHeader) {
    return null;
  }

  return (
    <div className="sticky top-16 z-40 border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-auto min-h-12 items-center justify-between px-2 sm:px-6 lg:px-8 py-1">
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-x-1 gap-y-1 sm:gap-x-2 overflow-x-auto hide-scrollbar">
            <div className="flex-shrink-0">
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
                     <div className="flex items-center justify-between w-full">
                        <span>2-Wheeler</span>
                        <Badge variant="outline" className="text-xs ml-2">Coming soon</Badge>
                     </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-x-1 gap-y-1 sm:gap-x-2 whitespace-nowrap pr-4">
              <Button
                onClick={handleMyFavouritesClick}
                variant="link"
                className="h-7 px-1 text-xs sm:h-8 sm:px-2 sm:text-sm font-medium text-muted-foreground"
              >
              My Favourites
              </Button>
              <Button
                onClick={handleStartSellingClick}
                variant="link"
                className="h-7 px-1 text-xs sm:h-8 sm:px-2 sm:text-sm font-medium text-muted-foreground"
                disabled
              >
                <div className="flex items-center gap-1.5">
                  <span>Start Selling</span>
                  <Badge variant="outline" className="text-xs text-accent border-accent px-1.5 py-0">Soon</Badge>
                </div>
              </Button>
              <Button
                asChild
                variant="link"
                className="h-7 px-1 text-xs sm:h-8 smpx-2 sm:text-sm font-medium text-muted-foreground"
              >
                <Link href="/faq">FAQ</Link>
              </Button>
              <Button
                asChild
                variant="link"
                className="h-7 px-1 text-xs sm:h-8 sm:px-2 sm:text-sm font-medium text-muted-foreground"
              >
                <Link href="/contact">Support</Link>
              </Button>
            </div>
          </div>
        </div>
         <Button onClick={requestLocation} variant="ghost" size="icon" className="h-8 w-8 ml-2 flex-shrink-0">
            <MapPin className={cn("h-5 w-5", hasLocationAccess ? 'text-green-500' : 'text-muted-foreground')} />
            <span className="sr-only">Detect Location</span>
          </Button>
      </div>
    </div>
  );
}
