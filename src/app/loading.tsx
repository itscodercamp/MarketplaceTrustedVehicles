export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-primary leading-tight">
          Trusted Vehicles Marketplace
        </h1>
        <p className="text-lg text-muted-foreground mt-1">Loading your next great ride...</p>
      </div>
      <div className="relative w-full h-24 overflow-x-hidden">
        <div className="absolute top-1/2 -translate-y-1/2 w-full">
           <div className="car-animation">
            <div className="car-body">
              <div className="car-top"></div>
              <div className="wheel front"></div>
              <div className="wheel rear"></div>
            </div>
            <div className="dust d1"></div>
            <div className="dust d2"></div>
            <div className="dust d3"></div>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-1 bg-border rounded-full overflow-hidden mt-4">
          <div className="h-full bg-primary animate-pulse w-full"></div>
      </div>
    </div>
  );
}
