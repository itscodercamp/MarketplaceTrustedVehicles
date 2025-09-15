
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link";

const faqs = [
    {
        question: "1. What is Trusted Vehicles Marketplace?",
        answer: "Trusted Vehicles Marketplace is an online platform where you can buy and sell verified, high-quality used vehicles. We connect buyers with trusted dealers to ensure a safe and transparent transaction."
    },
    {
        question: "2. How are vehicles 'verified'?",
        answer: "Our 'verified' badge means the vehicle has undergone a basic documentation check. For a more thorough evaluation, we recommend using our AI Condition Report tool or a professional inspection service. This ensures you have all the details before making a purchase."
    },
    {
        question: "3. How can I buy a vehicle?",
        answer: "Browse our listings, use the filters to narrow down your options, and view the details of any vehicle you're interested in. You can save your favorites to your profile and contact the dealer directly through the information provided on the vehicle page."
    },
    {
        question: "4. How do I start selling my vehicle?",
        answer: "To sell a vehicle, you need to register as a dealer. Click on the 'Start Selling' button, create a dealer account, and you'll be able to list your vehicles for sale on our platform. This feature is currently in development and will be available soon."
    },
    {
        question: "5. Can I negotiate the price?",
        answer: "Pricing is set by the seller. While some sellers may be open to negotiation, this must be discussed directly with them. Trusted Vehicles Marketplace does not get involved in price negotiations."
    },
    {
        question: "6. What is the AI Condition Report?",
        answer: "Our AI Condition Report is a unique tool that allows you to upload photos and details of a vehicle to get a comprehensive, AI-generated inspection report. It helps identify the vehicle's condition based on a 70-point checklist, providing you with more confidence in your purchase."
    },
    {
        question: "7. How does the AI Chatbot work?",
        answer: "Our AI Chatbot is your personal assistant for finding the perfect vehicle. You can tell it your preferences like budget, make, model, or family needs, and it will search our listings and provide you with the best recommendations."
    },
    {
        question: "8. What if I have an issue with a vehicle I purchased?",
        answer: "Trusted Vehicles Marketplace is a platform that connects buyers and sellers. All transactions are made directly with the dealer. We recommend thoroughly inspecting any vehicle and reviewing all documents before purchase. If you have an issue, you should contact the dealer first."
    },
    {
        question: "9. How do I save my favorite vehicles?",
        answer: "When you are browsing, you will see a heart icon on each vehicle listing. Simply click the heart to save it. You must be logged in to use this feature. You can view all your saved vehicles on your 'My Favourites' page, accessible from your profile."
    },
    {
        question: "10. Is my personal information safe?",
        answer: "Yes, we take data privacy seriously. Your personal information is used to facilitate communication and transactions on the platform. We do not share your data with third parties without your consent. Please review our Privacy Policy for more details."
    }
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find answers to common questions about our marketplace.
        </p>
      </header>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                        <p>{faq.answer}</p>
                        <p className="mt-4">
                            Still have questions? Please don't hesitate to{' '}
                            <Link href="/contact" className="text-primary hover:underline">
                                contact us
                            </Link>
                            .
                        </p>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
