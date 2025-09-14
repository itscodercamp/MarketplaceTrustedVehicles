'use client';
import { useVehicleFilterStore } from '@/store/vehicle-filters';
import { FuelType, Condition, SortOption } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const fuelTypes: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'CNG'];
const conditions: Condition[] = ['New', 'Like New', 'Good', 'Fair'];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc', label: 'Year: Newest First' },
  { value: 'year-asc', label: 'Year: Oldest First' },
  { value: 'kms-asc', label: 'KMs: Low to High' },
  { value: 'kms-desc', label: 'KMs: High to Low' },
];

export default function VehicleFilters() {
  const { filters, sort, toggleFilter, setSort, clearFilters } = useVehicleFilterStore();

  const handleCheckboxToggle = (filterType: keyof typeof filters, value: string) => {
    toggleFilter(filterType, value);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="sort-by" className="text-lg font-semibold">Sort By</Label>
        <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
          <SelectTrigger id="sort-by" className="w-full mt-2">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Fuel Type</h3>
        <div className="space-y-2">
          {fuelTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`fuel-${type}`}
                checked={filters.fuelType.includes(type)}
                onCheckedChange={() => handleCheckboxToggle('fuelType', type)}
              />
              <Label htmlFor={`fuel-${type}`} className="font-normal cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Condition</h3>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={`condition-${condition}`}
                checked={filters.condition.includes(condition)}
                onCheckedChange={() => handleCheckboxToggle('condition', condition)}
              />
              <Label htmlFor={`condition-${condition}`} className="font-normal cursor-pointer">
                {condition}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );
}
