"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  isVehicleSaved: (vehicleId: string) => boolean;
  toggleSaveVehicle: (vehicleId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  savedVehicles: ['2', '5'],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = () => {
    setUser(mockUser);
    toast({
      title: 'Login Successful',
      description: `Welcome back, ${mockUser.name}!`,
      variant: 'default'
    });
  };

  const logout = () => {
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  };

  const isVehicleSaved = (vehicleId: string) => {
    return user?.savedVehicles.includes(vehicleId) ?? false;
  };

  const toggleSaveVehicle = (vehicleId: string) => {
    if (!user) {
      // This case is handled in the component to avoid duplicate toasts
      return;
    }

    setUser(currentUser => {
      if (!currentUser) return null;
      
      const isSaved = currentUser.savedVehicles.includes(vehicleId);
      const updatedSavedVehicles = isSaved
        ? currentUser.savedVehicles.filter(id => id !== vehicleId)
        : [...currentUser.savedVehicles, vehicleId];
        
      if (isSaved) {
        toast({ title: 'Vehicle Removed', description: 'Removed from your saved list.' });
      } else {
        toast({ title: 'Vehicle Saved!', description: 'Added to your saved list.' });
      }

      return { ...currentUser, savedVehicles: updatedSavedVehicles };
    });
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, isVehicleSaved, toggleSaveVehicle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
