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

export default function SubHeader() {
  const {
    filters: { vehicleType },
    setVehicleType,
  } = useVehicleFilterStore();
  return (
    <div className="sticky top-16 z-40 border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-12 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 px-2 text-sm font-medium"
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

          <Button variant="ghost" className="h-8 px-2 text-sm font-medium">
            <MapPin className="mr-1 h-4 w-4" />
            Auto Detect
          </Button>

          <div className="hidden items-center gap-2 md:flex">
            <Button
              asChild
              variant="link"
              className="h-8 px-2 text-sm font-medium text-muted-foreground"
            >
              <Link href="/profile">My Favourites</Link>
            </Button>
            <Button
              variant="link"
              className="h-8 px-2 text-sm font-medium text-muted-foreground"
            >
              Start Selling
            </Button>
            <Button
              variant="link"
              className="h-8 px-2 text-sm font-medium text-muted-foreground"
            >
              FAQ
            </Button>
            <Button
              variant="link"
              className="h-8 px-2 text-sm font-medium text-muted-foreground"
            >
              Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
