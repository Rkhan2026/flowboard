import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import {
  ClerkProvider,
 
} from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "flowboard",
  description: "project management app",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased animated-dotted-background`} >
         <ThemeProvider attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
          <Header/> 
            
            <main className="min-h-screen">
                  {children}
            </main>
           
           <Footer/>
          
         </ThemeProvider>
        
      </body>
    </html>
    </ClerkProvider>
  );
}