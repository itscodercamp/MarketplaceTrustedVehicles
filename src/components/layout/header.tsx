'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { PanelLeftOpen, LayoutGrid, List, User, ArrowLeft } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLayoutStore } from '@/store/layout-store';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user, login, logout } = useAuth();
  const { layout, setLayout } = useLayoutStore();
  const pathname = usePathname();
  const router = useRouter();

  const isVehicleDetailPage = pathname.startsWith('/vehicle/');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          {isVehicleDetailPage ? (
            <Button variant="ghost" size="icon" className="mr-2 h-8 w-8 lg:hidden" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          ) : (
            <SidebarTrigger asChild className="mr-2 h-8 w-8 lg:hidden">
              <Button variant="ghost" size="icon">
                <PanelLeftOpen className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </SidebarTrigger>
          )}
          <Link href="/" className="flex flex-col -my-2">
            <span className="text-xl font-bold tracking-tight text-primary leading-tight">
              Marketplace
            </span>
            <span className="text-xs text-muted-foreground leading-tight -mt-0.5">
              by Trusted Vehicles
            </span>
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center rounded-md bg-muted p-1">
            <Button
              variant={layout === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setLayout('grid')}
              className={cn(
                'h-8 px-2 sm:px-3',
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
                'h-8 px-2 sm:px-3',
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
                  <Avatar className="h-9 w-9">
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
            <Button onClick={login} variant="ghost" size="icon" className="h-9 w-9">
              <User className="h-5 w-5" />
              <span className="sr-only">Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
