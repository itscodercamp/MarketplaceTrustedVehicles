
'use client';

import { useState } from 'react';
import { useVehicleFilterStore } from '@/store/vehicle-filters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useVehicleFilterStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = () => {
    setSearchQuery(localQuery);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-muted/50 border-y">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by make, model, year, fuel type, price..."
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full rounded-full pl-10 pr-24 py-3 h-12 text-base"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {localQuery && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={handleClear}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Clear search</span>
                        </Button>
                    )}
                    <Button
                        onClick={handleSearch}
                        className="rounded-full font-semibold"
                    >
                        Search
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
}
