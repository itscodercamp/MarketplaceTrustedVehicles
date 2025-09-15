export default function AdBanner() {
  return (
    <div className="bg-muted">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-2">
        <div className="bg-card border rounded-lg h-[115px] sm:h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground text-center">
            Ad Banner Placeholder
            <br />
            <span className="text-sm">(115px on mobile, 200px on desktop)</span>
          </p>
        </div>
      </div>
    </div>
  );
}
