'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateVehicleConditionReport } from '@/ai/flows/generate-vehicle-condition-report';
import type { GenerateVehicleConditionReportInput } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Upload, Car, Sparkles, FileText, Loader2 } from 'lucide-react';
import Image from 'next/image';

// Simple markdown to HTML renderer
const Markdown = ({ content }: { content: string }) => {
  const htmlContent = content
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold my-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold my-3">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold my-2">$1</h3>')
    .replace(/\* \*(.*?)\* \*/gim, '<strong>$1</strong>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/\n/g, '<br />');

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};


export default function GenerateReportPage() {
  const [formData, setFormData] = useState({
    vehicleDescription: '',
    condition: '',
    features: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, condition: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);

      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prevImages) => [...prevImages, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vehicleDescription || !formData.condition || images.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all required fields and upload at least one image.',
      });
      return;
    }

    setIsLoading(true);
    setReport(null);

    try {
      const input: GenerateVehicleConditionReportInput = {
        vehicleDescription: formData.vehicleDescription,
        condition: formData.condition,
        features: formData.features,
        images: images,
      };
      const result = await generateVehicleConditionReport(input);
      setReport(result.report);
      toast({
        title: 'Report Generated Successfully!',
        description: 'Your AI-powered vehicle condition report is ready.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          AI Vehicle Condition Report
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Upload your vehicle's details and images to generate a comprehensive report.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-card p-8 rounded-xl border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="vehicleDescription" className="flex items-center gap-2 text-base">
                <Car className="w-5 h-5 text-primary"/>
                Vehicle Description
              </Label>
              <Input
                id="vehicleDescription"
                name="vehicleDescription"
                value={formData.vehicleDescription}
                onChange={handleInputChange}
                placeholder="e.g., 2021 Maruti Suzuki Swift VXI"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition" className="flex items-center gap-2 text-base">
                <Sparkles className="w-5 h-5 text-primary"/>
                Overall Condition
              </Label>
               <Select onValueChange={handleSelectChange} value={formData.condition} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Like New">Like New</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features" className="flex items-center gap-2 text-base">
                <FileText className="w-5 h-5 text-primary"/>
                Features & Options (Optional)
              </Label>
              <Textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="e.g., Sunroof, Alloy Wheels, Touchscreen Display"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images" className="flex items-center gap-2 text-base">
                <Upload className="w-5 h-5 text-primary"/>
                Upload Images
              </Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                required
              />
               <p className="text-xs text-muted-foreground pt-1">You can select multiple images. More images result in a better report.</p>
            </div>

            {images.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Image Previews:</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {images.map((src, index) => (
                    <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                      <Image src={src} alt={`Upload preview ${index + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                'Generate AI Report'
              )}
            </Button>
          </form>
        </div>

        <div className="bg-card p-8 rounded-xl border shadow-sm prose prose-sm max-w-none">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Generated Report</h2>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
               <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
               <p className="text-muted-foreground">Analyzing your vehicle... this may take a moment.</p>
            </div>
          )}
          {report ? (
             <div className="prose prose-sm max-w-none text-card-foreground">
                <Markdown content={report} />
             </div>
          ) : (
             !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                 <FileText className="h-12 w-12 text-muted-foreground/50 mb-4"/>
                 <p className="text-muted-foreground">Your generated report will appear here.</p>
              </div>
             )
          )}
        </div>
      </div>
    </div>
  );
}
