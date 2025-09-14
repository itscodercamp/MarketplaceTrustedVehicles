"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import UserNav from '@/components/auth/user-nav';
import { useAuth } from '@/context/auth-provider';
import { SidebarTrigger } from '../ui/sidebar';
import { PanelLeft } from 'lucide-react';

export default function Header() {
  const { user, login } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <SidebarTrigger asChild className="mr-2">
             <Button variant="ghost" size="icon" className="md:hidden">
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
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground font-semibold hidden md:block"
          >
            Marketplace
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
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
