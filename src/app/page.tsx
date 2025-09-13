import VehicleGrid from '@/components/vehicles/vehicle-grid';
import { vehicles } from '@/lib/data';
import VehicleFilters from '@/components/vehicles/vehicle-filters';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <>
      <Sidebar side="left" collapsible="offcanvas">
        <VehicleFilters />
      </Sidebar>
      <SidebarInset>
        <div className="container mx-auto px-4 py-8">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-headline font-bold tracking-tight text-primary md:text-4xl">
              Trusted Vehicles Marketplace
            </h1>
            <p className="mt-1 text-base text-muted-foreground">
              Browse our curated selection of trusted and verified vehicles.
            </p>
          </header>
          <VehicleGrid vehicles={vehicles} />
        </div>
      </SidebarInset>
    </>
  );
}
