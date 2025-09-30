
'use client';

import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
});

export default function ContactUsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
    
    setIsSubmitting(false);
    form.reset();
    
    toast({
      title: 'Message Sent!',
      description: "We've received your message and will get back to you shortly.",
      variant: 'success',
    });
  }

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
                    <a href="tel:+918767273110" className="text-primary hover:underline">
                      +91 87672 73110
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
                <h3 className="font-semibold mb-4">Send us a message</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="How can we help you?"
                              className="resize-none"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                           <Send className="mr-2 h-4 w-4" />
                           Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
