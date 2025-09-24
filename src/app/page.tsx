
import { getVehicles } from '@/lib/services/vehicle-service';
import VehicleGrid from '@/components/vehicles/vehicle-grid';
import AdBanner from '@/components/layout/ad-banner';

export default async function Home() {
  
  const allVehicles = await getVehicles();
  const fourWheelers = allVehicles.filter(v => v.vehicleType === '4-wheeler');

  return (
    <>
      <AdBanner />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VehicleGrid vehicles={fourWheelers} />
      </div>
    </>
  );
}
