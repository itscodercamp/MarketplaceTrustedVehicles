
'use client';
import React from 'react';
import { useVehicleFilterStore } from '@/store/vehicle-filters';
import { FuelType, SortOption, Transmission, Ownership } from '@/lib/types';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const fourWheelerFuelTypes: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'CNG'];
const twoWheelerFuelTypes: FuelType[] = ['Petrol', 'Electric'];
const transmissions: Transmission[] = ['Automatic', 'Manual'];
const ownerships: Ownership[] = ['1st Owner', '2nd Owner', '3rd Owner'];

// Statically define some common year ranges and RTOs for filtering.
// In a real-world scenario, these could be dynamically generated from the available vehicle data.
const yearRanges = ['2020-Present', '2015-2019', '2010-2014', '2005-2009', 'Before 2005'];
const rtoStates = ['MH', 'DL', 'KA', 'TN', 'GJ'];


const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc', label: 'Year: Newest First' },
  { value: 'year-asc', label: 'Year: Oldest First' },
  { value: 'kms-asc', label: 'KMs: Low to High' },
  { value: 'kms-desc', label: 'KMs: High to Low' },
];

export default function VehicleFilters() {
  const { filters, sort, toggleMultiFilter, setSort, clearFilters } = useVehicleFilterStore();
  const { vehicleType } = filters;

  const fuelTypes = vehicleType === '4-wheeler' ? fourWheelerFuelTypes : twoWheelerFuelTypes;

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

      <Accordion type="multiple" defaultValue={['fuelType', 'year', 'ownership', 'rto', 'transmission']} className="w-full">
        <AccordionItem value="fuelType">
          <AccordionTrigger className="text-lg font-semibold">Fuel Type</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {fuelTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`fuel-${type}`}
                  checked={filters.fuelType.includes(type)}
                  onCheckedChange={() => toggleMultiFilter('fuelType', type)}
                />
                <Label htmlFor={`fuel-${type}`} className="font-normal cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="year">
          <AccordionTrigger className="text-lg font-semibold">Year</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {yearRanges.map((range) => (
              <div key={range} className="flex items-center space-x-2">
                <Checkbox
                  id={`year-${range}`}
                  checked={filters.year.includes(range)}
                  onCheckedChange={() => toggleMultiFilter('year', range)}
                />
                <Label htmlFor={`year-${range}`} className="font-normal cursor-pointer">
                  {range}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="ownership">
          <AccordionTrigger className="text-lg font-semibold">Ownership</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {ownerships.map((owner) => (
              <div key={owner} className="flex items-center space-x-2">
                <Checkbox
                  id={`owner-${owner}`}
                  checked={filters.ownership.includes(owner)}
                  onCheckedChange={() => toggleMultiFilter('ownership', owner)}
                />
                <Label htmlFor={`owner-${owner}`} className="font-normal cursor-pointer">
                  {owner}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="rto">
          <AccordionTrigger className="text-lg font-semibold">RTO</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {rtoStates.map((rto) => (
              <div key={rto} className="flex items-center space-x-2">
                <Checkbox
                  id={`rto-${rto}`}
                  checked={filters.rto.includes(rto)}
                  onCheckedChange={() => toggleMultiFilter('rto', rto)}
                />
                <Label htmlFor={`rto-${rto}`} className="font-normal cursor-pointer">
                  {rto}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="transmission">
          <AccordionTrigger className="text-lg font-semibold">Transmission</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {transmissions.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`transmission-${type}`}
                  checked={filters.transmission.includes(type)}
                  onCheckedChange={() => toggleMultiFilter('transmission', type)}
                />
                <Label htmlFor={`transmission-${type}`} className="font-normal cursor-pointer">
                  {type}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

      </Accordion>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );
}
