import { vehicles } from '@/lib/data';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import VehicleFilters from '@/components/vehicles/vehicle-filters';
import VehicleGrid from '@/components/vehicles/vehicle-grid';

export default function Home() {
  return (
    <div className="flex">
      <Sidebar side="left" collapsible="desktop">
        <VehicleFilters />
      </Sidebar>
      <SidebarInset>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <VehicleGrid vehicles={vehicles} />
        </div>
      </SidebarInset>
    </div>
  );
}
