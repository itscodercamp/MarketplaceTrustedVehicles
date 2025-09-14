"use client";

import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import UserNav from '@/components/auth/user-nav';
import { useAuth } from '@/context/auth-provider';
import { SidebarTrigger } from '../ui/sidebar';

export default function Header() {
  const { user, login } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <SidebarTrigger className="md:hidden mr-2" />
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            <span className="font-bold hidden sm:inline-block">OLX</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground font-semibold"
            >
              Marketplace
            </Link>
          </nav>
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
