import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { ListRestart, X } from 'lucide-react';
import type { FuelType, Condition } from '@/lib/types';
import { useVehicleFilterStore } from '@/store/vehicle-filters';
import { SidebarHeader, SidebarClose, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "../ui/sidebar";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

const fuelTypes: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'CNG'];
const conditions: Condition[] = ['New', 'Like New', 'Good', 'Fair'];

export default function VehicleFilters() {
  const {
    filters,
    sort,
    setSort,
    toggleFilter,
    clearFilters,
    resultCount,
  } = useVehicleFilterStore();

  const activeFilterCount = filters.fuelType.length + filters.condition.length;

  return (
    <>
      <SidebarHeader className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <ListRestart className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            )}
            <SidebarClose asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <X className="h-5 w-5" />
                </Button>
            </SidebarClose>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0">
        <div className="p-4 space-y-6">
            <SidebarGroup>
                <SidebarGroupLabel>Sort By</SidebarGroupLabel>
                <SidebarGroupContent>
                    <Select value={sort} onValueChange={(value) => setSort(value as any)}>
                        <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="year-desc">Year: Newest First</SelectItem>
                        <SelectItem value="year-asc">Year: Oldest First</SelectItem>
                        <SelectItem value="kms-asc">Kms: Low to High</SelectItem>
                        <SelectItem value="kms-desc">Kms: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Fuel Type</SidebarGroupLabel>
                <SidebarGroupContent className="space-y-3">
                    {fuelTypes.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                                id={`fuel-${type}`}
                                checked={filters.fuelType.includes(type)}
                                onCheckedChange={() => toggleFilter('fuelType', type)}
                            />
                            <Label htmlFor={`fuel-${type}`} className="font-normal">{type}</Label>
                        </div>
                    ))}
                </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Condition</SidebarGroupLabel>
                <SidebarGroupContent className="space-y-3">
                    {conditions.map(condition => (
                        <div key={condition} className="flex items-center space-x-2">
                            <Checkbox
                                id={`condition-${condition}`}
                                checked={filters.condition.includes(condition)}
                                onCheckedChange={() => toggleFilter('condition', condition)}
                            />
                            <Label htmlFor={`condition-${condition}`} className="font-normal">{condition}</Label>
                        </div>
                    ))}
                </SidebarGroupContent>
            </SidebarGroup>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <p className="text-sm text-muted-foreground text-center">
            {resultCount} {resultCount === 1 ? 'vehicle' : 'vehicles'} found
        </p>
      </SidebarFooter>
    </>
  );
}
