import VehicleGrid from '@/components/vehicles/vehicle-grid';
import { vehicles } from '@/lib/data';
import VehicleFilters from '@/components/vehicles/vehicle-filters';
import { Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Sidebar side="left" collapsible="icon">
        <VehicleFilters />
      </Sidebar>
      <SidebarInset>
        <div className="py-8">
          <header className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <PanelLeft />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
              </SidebarTrigger>
               <h1 className="text-3xl font-headline font-bold tracking-tight text-primary md:text-4xl">
                Trusted Vehicles Marketplace
              </h1>
            </div>
          </header>
          <div className="flex justify-center">
            <VehicleGrid vehicles={vehicles} />
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
