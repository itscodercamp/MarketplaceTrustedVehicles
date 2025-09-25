'use client';
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/auth-provider";
import Header from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import Footer from "@/components/layout/footer";
import AiChatbot from "@/components/chatbot/ai-chatbot";
import SubHeader from "@/components/layout/sub-header";
import { usePathname } from 'next/navigation';
import VehicleFilters from "@/components/vehicles/vehicle-filters";
import { useEffect, useState } from "react";
import PreLoader from "@/components/layout/pre-loader";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showSidebar = pathname === '/';
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This now just prevents a flash of the pre-loader.
    // The main app content will appear as soon as it's ready.
    setLoading(false);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#2962FF" />
        <meta name="manifest" content="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cn("font-body antialiased", roboto.variable)}>
        {loading ? <PreLoader /> : (
          <AuthProvider>
            <SidebarProvider>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <SubHeader />
                <div className="flex flex-1">
                  {showSidebar && (
                    <Sidebar side="left">
                      <VehicleFilters />
                    </Sidebar>
                  )}
                  <main className={cn("flex-1", showSidebar && "lg:ml-72")}>
                    {children}
                  </main>
                </div>
                <Footer />
              </div>
              <Toaster />
              <AiChatbot />
            </SidebarProvider>
          </AuthProvider>
        )}
      </body>
    </html>
  );
}
