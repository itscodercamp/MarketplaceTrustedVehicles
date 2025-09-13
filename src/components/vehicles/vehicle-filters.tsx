"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Filter, ListRestart } from 'lucide-react';
import type { Filters, FuelType, Condition, SortOption } from '@/lib/types';

interface VehicleFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sort: SortOption;
  setSort: React.Dispatch<React.SetStateAction<SortOption>>;
  resultCount: number;
}

const fuelTypes: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'CNG'];
const conditions: Condition[] = ['New', 'Like New', 'Good', 'Fair'];

export default function VehicleFilters({ filters, setFilters, sort, setSort, resultCount }: VehicleFiltersProps) {

  const handleFilterChange = (filterType: keyof Filters, value: FuelType | Condition) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const clearFilters = () => {
    setFilters({ fuelType: [], condition: [] });
  }

  const activeFilterCount = filters.fuelType.length + filters.condition.length;

  return (
    <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-card border shadow-sm">
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Fuel Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {fuelTypes.map(type => (
                    <DropdownMenuCheckboxItem
                    key={type}
                    checked={filters.fuelType.includes(type)}
                    onCheckedChange={() => handleFilterChange('fuelType', type)}
                    >
                    {type}
                    </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Condition</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {conditions.map(condition => (
                    <DropdownMenuCheckboxItem
                    key={condition}
                    checked={filters.condition.includes(condition)}
                    onCheckedChange={() => handleFilterChange('condition', condition)}
                    >
                    {condition}
                    </DropdownMenuCheckboxItem>
                ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {activeFilterCount > 0 && (
                 <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <ListRestart className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            )}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
            <p className="text-sm text-muted-foreground whitespace-nowrap">{resultCount} vehicles found</p>
            <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
                <SelectTrigger className="w-full md:w-[180px]">
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
        </div>
    </div>
  );
}
