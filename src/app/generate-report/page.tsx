import ConditionReportForm from '@/components/ai/condition-report-form';

export default function GenerateReportPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-headline font-bold tracking-tight text-primary md:text-5xl">
          AI-Powered Condition Report
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Provide your vehicle's details and let our AI generate a professional condition report for you in seconds.
        </p>
      </div>
      <ConditionReportForm />
    </div>
  );
}
