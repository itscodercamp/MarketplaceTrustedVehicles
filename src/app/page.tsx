import VehicleGrid from '@/components/vehicles/vehicle-grid';
import { vehicles } from '@/lib/data';
import VehicleFilters from '@/components/vehicles/vehicle-filters';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';

export default function Home() {
  return (
    <>
      <Sidebar side="left" collapsible="icon">
        <VehicleFilters />
      </Sidebar>
      <SidebarInset>
        <div className="container mx-auto px-4 py-8">
          <VehicleGrid vehicles={vehicles} />
        </div>
      </SidebarInset>
    </>
  );
}
