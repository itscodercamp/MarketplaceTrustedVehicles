"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import UserNav from '@/components/auth/user-nav';
import { useAuth } from '@/context/auth-provider';
import { SidebarTrigger } from '../ui/sidebar';
import { PanelLeft, SlidersHorizontal } from 'lucide-react';
import { useSidebar } from '../ui/sidebar';

export default function Header() {
  const { user, login } = useAuth();
  const { isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex items-center">
          <SidebarTrigger asChild>
            <Button variant="ghost" size="icon">
              <PanelLeft />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SidebarTrigger>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold sm:inline-block">
              Trusted Vehicles Marketplace
            </span>
          </Link>
        </div>
        
        <div className="md:hidden mr-4">
             <SidebarTrigger asChild>
              <Button variant="ghost" size="icon">
                <SlidersHorizontal />
                <span className="sr-only">Toggle Filters</span>
              </Button>
            </SidebarTrigger>
        </div>

        <div className="flex flex-1 items-center justify-center md:justify-start space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground font-semibold"
          >
           <span className="md:hidden font-bold">Trusted Vehicles</span>
           <span className="hidden md:block">Marketplace</span>
          </Link>
        </div>
        <div className="flex items-center justify-end space-x-2 sm:space-x-4">
          {user ? (
            <UserNav />
          ) : (
            <Button onClick={login}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
