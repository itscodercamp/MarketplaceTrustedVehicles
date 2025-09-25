
'use client';

import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Lock, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface GetBestPriceProps {
  vehicleId: string;
}

export default function GetBestPrice({ vehicleId }: GetBestPriceProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleShare = () => {
    const url = `${window.location.origin}/vehicle/${vehicleId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied!',
      description: 'Vehicle link has been copied to your clipboard.',
      variant: 'success',
    });
  };

  if (!user) {
    return (
      <Card className="shadow-lg border-primary border-dashed">
        <CardHeader className="flex-row items-center gap-4">
          <Lock className="w-8 h-8 text-primary" />
          <CardTitle>Unlock Best Price</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Please log in to see the dealer's contact information and get the best price for this vehicle.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href={`/login?redirect=/vehicle/${vehicleId}`}>Login to Continue</Link>
            </Button>
            <Button variant="secondary" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Get Best Price</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary"/>
                <div>
                    <p className="text-sm text-muted-foreground">Dealer Contact</p>
                    <a href="tel:+919876543210" className="font-semibold text-lg hover:underline">+91 98765 43210</a>
                </div>
            </div>
             <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-green-500"/>
                <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="font-semibold text-lg hover:underline">Chat Now</a>
                </div>
            </div>
          </div>
           <div className="flex items-center justify-start md:justify-end gap-4">
              <Button variant="secondary" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Vehicle
              </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

    
