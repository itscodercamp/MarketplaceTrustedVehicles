import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} Trusted Vehicles Marketplace. All rights reserved.</p>
            <p>Dealer registration required to list vehicles. Legal Marketplace.</p>
          </div>
          <div className="text-center sm:text-right">
            <p>
              Made by{' '}
              <Link href="https://trustedvehicles.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                Trusted Vehicles
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
