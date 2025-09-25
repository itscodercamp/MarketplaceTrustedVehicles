
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, LoginCredentials, RegisterPayload } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isVehicleSaved: (vehicleId: string) => boolean;
  toggleSaveVehicle: (vehicleId: string) => void;
  loading: boolean;
}

const API_BASE_URL = 'https://9000-firebase-studio-1757611792048.cluster-ancjwrkgr5dvux4qug5rbzyc2y.cloudworkstations.dev/api/marketplace/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Failed to parse user data from localStorage', error);
      // Clear corrupted data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);
  
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { token, ...userData } = data.user;
      
      setUser(userData);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);

      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userData.name}!`,
      });

      const redirectUrl = pathname.includes('redirect=') 
        ? pathname.split('redirect=')[1] 
        : '/profile';
      router.push(redirectUrl);

    } catch (error: any) {
      console.error("Login Error: ", error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        toast({
            title: 'Registration Successful!',
            description: 'You can now log in with your credentials.',
        });
        router.push('/login');

    } catch (error: any) {
        console.error("Registration Error: ", error);
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: error.message || 'An unknown error occurred.',
        });
    } finally {
        setLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  };

  const isVehicleSaved = (vehicleId: string) => {
    return user?.savedVehicles?.includes(vehicleId) ?? false;
  };

  const toggleSaveVehicle = (vehicleId: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'Please log in to save vehicles.',
      });
      router.push(`/login?redirect=/vehicle/${vehicleId}`);
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
      
      const updatedUser = { ...currentUser, savedVehicles: updatedSavedVehicles };
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist change
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isVehicleSaved, toggleSaveVehicle, loading }}>
      {!loading && children}
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
