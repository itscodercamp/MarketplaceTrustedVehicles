'use client';
import * as React from 'react';
import {cva} from 'class-variance-authority';
import {cn} from '@/lib/utils';
import {X} from 'lucide-react';
import {useIsMobile} from '@/hooks/use-mobile';
import {Slot} from '@radix-ui/react-slot';

const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  isDesktop: boolean;
} | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

function SidebarProvider({children}: {children: React.ReactNode}) {
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;
  const [open, setOpen] = React.useState(isDesktop);

  React.useEffect(() => {
    setOpen(isDesktop);
  }, [isDesktop]);

  return (
    <SidebarContext.Provider value={{open, setOpen, isDesktop}}>
      {children}
    </SidebarContext.Provider>
  );
}

const sidebarVariants = cva(
  'transition-all duration-300 ease-in-out z-40',
  {
    variants: {
      side: {
        left: 'border-r',
        right: 'border-l',
      },
      isDesktop: {
        true: 'w-72 p-4',
        false: 'fixed bg-background top-16 h-[calc(100vh-4rem)] p-4',
      },
      state: {
        open: '',
        closed: '',
      },
    },
    compoundVariants: [
      {
        isDesktop: false,
        side: 'left',
        state: 'closed',
        className: '-translate-x-full',
      },
      {
        isDesktop: false,
        side: 'left',
        state: 'open',
        className: 'translate-x-0',
      },
       {
        isDesktop: false,
        side: 'right',
        state: 'closed',
        className: 'translate-x-full',
      },
      {
        isDesktop: false,
        side: 'right',
        state: 'open',
        className: 'translate-x-0',
      },
    ],
  }
);

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side: 'left' | 'right';
  }
>(({className, side, ...props}, ref) => {
  const {open, setOpen, isDesktop} = useSidebar();
  const state = open ? 'open' : 'closed';

  return (
    <>
      <aside
        ref={ref}
        className={cn(sidebarVariants({side, isDesktop, state, className}))}
        {...props}
      >
        {!isDesktop && (
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 p-2 rounded-full text-muted-foreground hover:bg-muted"
          >
            <X size={20} />
          </button>
        )}
        <div className="overflow-y-auto h-full">{props.children}</div>
      </aside>
      {!isDesktop && open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
});
Sidebar.displayName = 'Sidebar';


const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const { open, setOpen } = useSidebar();
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(className)}
      onClick={() => setOpen(!open)}
      {...props}
    />
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const { setOpen } = useSidebar();
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(className)}
      onClick={() => setOpen(false)}
      {...props}
    />
  );
});
SidebarClose.displayName = 'SidebarClose';


export {
  Sidebar,
  SidebarTrigger,
  SidebarClose,
  SidebarProvider,
  useSidebar,
};
