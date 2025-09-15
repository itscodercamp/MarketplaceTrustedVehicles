
import { Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactUsPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Contact Us
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          We're here to help. Reach out to us with any questions or concerns.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Email Support</h3>
                    <p className="text-muted-foreground">
                      For general inquiries and support, please email us.
                    </p>
                    <a href="mailto:support@trustedvehicles.com" className="text-primary hover:underline">
                      support@trustedvehicles.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Phone Support</h3>
                    <p className="text-muted-foreground">
                      Our phone lines are open from 9 AM to 6 PM IST, Mon-Sat.
                    </p>
                    <a href="tel:+911234567890" className="text-primary hover:underline">
                      +91 12345 67890
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Our Office</h3>
                    <p className="text-muted-foreground">
                      123 Auto Lane, Tech Park,
                      <br />
                      Pune, Maharashtra, 411057
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-muted/50 p-6 rounded-lg">
                 <h3 className="font-semibold mb-2">Send us a message</h3>
                 <p className="text-sm text-muted-foreground">This feature is coming soon. Please use email or phone for now.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
