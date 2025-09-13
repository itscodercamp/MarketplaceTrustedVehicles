"use client";

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-provider';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SaveVehicleButtonProps {
  vehicleId: string;
}

export default function SaveVehicleButton({ vehicleId }: SaveVehicleButtonProps) {
  const { user, isVehicleSaved, toggleSaveVehicle } = useAuth();
  
  const isSaved = user ? isVehicleSaved(vehicleId) : false;

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleSaveVehicle(vehicleId);
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            aria-label={isSaved ? "Unsave vehicle" : "Save vehicle"}
            className="h-8 w-8 text-muted-foreground hover:text-red-500"
          >
            <Heart className={cn("h-5 w-5 transition-colors", isSaved && "fill-red-500 text-red-500")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSaved ? 'Remove from favorites' : 'Add to favorites'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
