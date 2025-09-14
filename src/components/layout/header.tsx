'use client';
import Link from 'next/link';
import { useAuth } from '@/context/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen, LayoutGrid, List } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLayoutStore } from '@/store/layout-store';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user, login, logout } = useAuth();
  const { layout, setLayout } = useLayoutStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <SidebarTrigger asChild className="mr-2 lg:hidden">
            <Button variant="ghost" size="icon">
              <PanelLeftOpen className="h-6 w-6" />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </SidebarTrigger>
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-primary sm:text-xl"
          >
            Trusted Vehicles Marketplace
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center rounded-md bg-muted p-1">
            <Button
              variant={layout === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setLayout('grid')}
              className={cn(
                'h-8 px-3',
                layout === 'grid' && 'bg-background shadow-sm'
              )}
            >
              <LayoutGrid className="h-5 w-5" />
              <span className="sr-only">Grid View</span>
            </Button>
            <Button
              variant={layout === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setLayout('list')}
              className={cn(
                'h-8 px-3',
                layout === 'list' && 'bg-background shadow-sm'
              )}
            >
              <List className="h-5 w-5" />
              <span className="sr-only">List View</span>
            </Button>
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="User menu"
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={login}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
