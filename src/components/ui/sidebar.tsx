// This file is machine-generated - edit with care!

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
  collapsible: 'desktop' | 'offcanvas';
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
  const [open, setOpen] = React.useState(false);
  const collapsible = isMobile ? 'offcanvas' : 'desktop';

  React.useEffect(() => {
    setOpen(false);
  }, [collapsible]);

  return (
    <SidebarContext.Provider value={{open, setOpen, collapsible}}>
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
      collapsible: {
        desktop: '',
        offcanvas: 'fixed bg-background top-0 h-full',
      },
      state: {
        open: '',
        closed: '',
      },
      hasInset: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Desktop
      {
        collapsible: 'desktop',
        side: 'left',
        state: 'closed',
        className: '-translate-x-full w-0',
      },
      {
        collapsible: 'desktop',
        side: 'left',
        state: 'open',
        className: 'translate-x-0 w-72 p-4',
      },
      {
        collapsible: 'desktop',
        side: 'right',
        state: 'closed',
        className: 'translate-x-full w-0',
      },
      {
        collapsible: 'desktop',
        side: 'right',
        state: 'open',
        className: 'translate-x-0 w-72 p-4',
      },
      // Off-canvas
      {
        collapsible: 'offcanvas',
        side: 'left',
        state: 'closed',
        className: '-translate-x-full',
      },
      {
        collapsible: 'offcanvas',
        side: 'left',
        state: 'open',
        className: 'translate-x-0 w-72 p-4',
      },
      {
        collapsible: 'offcanvas',
        side: 'right',
        state: 'closed',
        className: 'translate-x-full',
      },
      {
        collapsible: 'offcanvas',
        side: 'right',
        state: 'open',
        className: 'translate-x-0 w-72 p-4',
      },
    ],
  }
);

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side: 'left' | 'right';
    collapsible?: 'desktop' | 'offcanvas';
  }
>(({className, side, collapsible: controlledCollapsible, ...props}, ref) => {
  const {open, setOpen, collapsible: contextCollapsible} = useSidebar();
  const collapsible = controlledCollapsible || contextCollapsible;
  const state = open ? 'open' : 'closed';
  const isOffcanvas = collapsible === 'offcanvas';

  return (
    <>
      <aside
        ref={ref}
        className={cn(sidebarVariants({side, collapsible, state, className}))}
        {...props}
      >
        {isOffcanvas && (
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 p-2 rounded-full text-muted-foreground hover:bg-muted"
          >
            <X size={20} />
          </button>
        )}
        <div className="overflow-y-auto h-full">{props.children}</div>
      </aside>
      {isOffcanvas && open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
});
Sidebar.displayName = 'Sidebar';

const sidebarInsetVariants = cva('transition-all duration-300 ease-in-out', {
  variants: {
    collapsible: {
      desktop: 'w-full',
      offcanvas: 'w-full',
    },
    state: {
      open: '',
      closed: '',
    },
    side: {
      left: '',
      right: '',
    },
  },
  compoundVariants: [
    {
      collapsible: 'desktop',
      state: 'open',
      side: 'left',
      className: 'lg:ml-72',
    },
    {
      collapsible: 'desktop',
      state: 'open',
      side: 'right',
      className: 'lg:mr-72',
    },
  ],
});

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => {
  const {open, collapsible} = useSidebar();
  const side = 'left'; // This can be made a prop if right-side is needed.
  const state = open ? 'open' : 'closed';

  return (
    <div
      ref={ref}
      className={cn(sidebarInsetVariants({collapsible, state, side, className}))}
      {...props}
    />
  );
});
SidebarInset.displayName = 'SidebarInset';

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, asChild, ...props }, ref) => {
  const { setOpen } = useSidebar();
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      className={cn(className)}
      onClick={() => setOpen(true)}
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
  SidebarInset,
  SidebarTrigger,
  SidebarClose,
  SidebarProvider,
  useSidebar,
};
