"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User as AuthUser } from 'firebase/auth';
import { onAuthStateChanged, FacebookAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (provider: 'google' | 'facebook' | 'phone') => void;
  logout: () => void;
  isVehicleSaved: (vehicleId: string) => boolean;
  toggleSaveVehicle: (vehicleId: string) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: AuthUser | null) => {
      if (firebaseUser) {
        // For now, we'll merge the firebase user with our mock saved vehicles data
        const appUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatarUrl: firebaseUser.photoURL || undefined,
          savedVehicles: user?.savedVehicles || [], // Preserve saved vehicles across sessions if needed
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.savedVehicles]);
  
  const login = async (provider: 'google' | 'facebook' | 'phone') => {
    let authProvider;
    if (provider === 'facebook') {
      authProvider = new FacebookAuthProvider();
    } else {
       toast({
        variant: 'destructive',
        title: 'Coming Soon',
        description: `${provider} login is not yet implemented.`,
      });
      return;
    }

    try {
      const result = await signInWithPopup(auth, authProvider);
      const firebaseUser = result.user;
       toast({
        title: 'Login Successful',
        description: `Welcome back, ${firebaseUser.displayName}!`,
      });
      router.push('/profile');
    } catch (error: any) {
      console.error("Authentication Error: ", error);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message,
      });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
       router.push('/');
    } catch (error: any) {
      console.error("Logout Error: ", error);
       toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message,
      });
    }
  };
  
  const isVehicleSaved = (vehicleId: string) => {
    return user?.savedVehicles.includes(vehicleId) ?? false;
  };

  const toggleSaveVehicle = (vehicleId: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'Please log in to save vehicles.',
      });
      router.push('/login');
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
    <AuthContext.Provider value={{ user, login, logout, isVehicleSaved, toggleSaveVehicle, loading }}>
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
