"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateVehicleConditionReport } from '@/lib/actions';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  vehicleDescription: z.string().min(10, 'Please provide a more detailed description.'),
  condition: z.string().min(1, 'Please select a condition.'),
  features: z.string().min(5, 'Please list at least one feature.'),
  image: z.any().refine(fileList => fileList.length === 1, 'Please upload one image.'),
});

type FormData = z.infer<typeof formSchema>;

export default function ConditionReportForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleDescription: '',
      condition: '',
      features: '',
      image: undefined,
    }
  });

  const fileRef = form.register("image");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setReport(null);

    const file = data.image[0] as File;
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result as string;
      try {
        const response = await generateVehicleConditionReport({
          vehicleDescription: data.vehicleDescription,
          condition: data.condition,
          features: data.features,
          images: base64Image,
        });
        setReport(response.conditionReport);
        toast({
            title: 'Report Generated!',
            description: 'Your AI-powered condition report is ready below.',
        });
      } catch (error) {
        console.error('Report generation error:', error);
        toast({
            variant: 'destructive',
            title: 'Error Generating Report',
            description: 'Something went wrong. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast({
            variant: 'destructive',
            title: 'Image Processing Error',
            description: 'Could not process the uploaded image.',
        });
        setIsLoading(false);
    };
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="vehicleDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Description (Make, Model, Year)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2021 Maruti Suzuki Swift VXI" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Like New">Like New</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Features</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Touchscreen infotainment, Alloy wheels, Automatic climate control..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Vehicle Image</FormLabel>
                    <FormControl>
                      <Input type="file" accept="image/*" {...fileRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Report
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isLoading || report) && (
        <Card className="mt-8 shadow-lg animate-in fade-in-50 duration-500">
            <CardContent className="p-6">
                <h3 className="text-2xl font-headline font-bold mb-4 flex items-center gap-2 text-primary">
                    <Sparkles className="h-6 w-6" />
                    Generated Condition Report
                </h3>
                {isLoading && !report && (
                    <div className="space-y-4">
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                    </div>
                )}
                {report && (
                    <div className="prose prose-blue max-w-none dark:prose-invert">
                        <p className="whitespace-pre-wrap">{report}</p>
                    </div>
                )}
            </CardContent>
        </Card>
      )}
    </>
  );
}
