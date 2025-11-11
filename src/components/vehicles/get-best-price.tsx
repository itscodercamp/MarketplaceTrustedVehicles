
'use client';

import { useAuth } from '@/context/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Lock, Phone, MessageCircle, Send, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface GetBestPriceProps {
  vehicleId: string;
  shareReportButton?: React.ReactNode;
}

const API_URL = 'https://apis.trustedvehicles.com/api/marketplace/inquiries';


export default function GetBestPrice({ vehicleId, shareReportButton }: GetBestPriceProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/vehicle/${vehicleId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied!',
      description: 'Vehicle link has been copied to your clipboard.',
      variant: 'success',
    });
  };
  
  const handleInquiry = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                vehicleId: vehicleId,
                userId: user.id,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
            throw new Error(errorData.message || 'Failed to submit inquiry.');
        }

        toast({
            title: 'Inquiry Sent!',
            description: "The dealer has been notified and will contact you shortly.",
            variant: 'success',
        });
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Inquiry Failed',
            description: error.message || 'Something went wrong. Please try again.',
        });
    } finally {
        setIsSubmitting(false);
    }
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
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary"/>
                  <div>
                      <p className="text-sm text-muted-foreground">Dealer Contact</p>
                      <a href="tel:+918767273110" className="font-semibold text-lg hover:underline">+91 87672 73110</a>
                  </div>
              </div>
               <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-green-500"/>
                  <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <a href="https://wa.me/918767273110" target="_blank" rel="noopener noreferrer" className="font-semibold text-lg hover:underline">Chat Now</a>
                  </div>
              </div>
          </div>
           <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t">
              <Button onClick={handleInquiry} disabled={isSubmitting} className="w-full sm:w-auto">
                 {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                       <Send className="mr-2 h-4 w-4" />
                       Inquire Now
                    </>
                  )}
              </Button>
              <Button variant="secondary" onClick={handleShare} className="w-full sm:w-auto">
                <Share2 className="w-4 h-4 mr-2" />
                Share Vehicle
              </Button>
              {shareReportButton}
            </div>
             <p className="text-xs text-muted-foreground text-center sm:text-left">Click "Inquire Now" to send your interest to the dealer. They will contact you on your registered number.</p>
        </div>
      </CardContent>
    </Card>
  );
}
