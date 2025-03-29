/**
 * app/page.js
 *
 * Purpose:
 * This is the main landing page for the app.
 * It includes:
 * - A hero section with a headline, logo, call-to-action buttons
 * - A features section showcasing the core benefits of the product
 * 
 * This is a static page rendered on the client.
 */

import React from "react";
import Link from "next/link";
import {
  ChevronRight, // Icon for button arrow
  Layout,       // Icon for Kanban boards
  Calendar,     // Icon for sprint planning
  BarChart,     // Icon for reports
  ArrowRight,   // (Unused here, can be removed)
} from "lucide-react";

import { Button } from "@/components/ui/button"; // Custom button component
import { Card, CardContent } from "@/components/ui/card"; // Card layout components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // (Accordion is imported but not used in this file)
import Image from "next/image"; // Optimized image component

// Feature list data
const features = [
  {
    title: "Intuitive Kanban Boards",
    description:
      "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
    icon: Layout,
  },
  {
    title: "Powerful Sprint Planning",
    description:
      "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
    icon: Calendar,
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Gain insights into your team's performance with detailed, customizable reports and analytics.",
    icon: BarChart,
  },
];

// Main component for the homepage
export default function Home() {
  return (
    <div className="min-h-screen">
      
      {/* ----------------- Hero Section ----------------- */}
      <section className="container mx-auto py-20 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
          Streamline Your Workflow <br />
          <span className="flex mx-auto gap-3 sm:gap-4 items-center">
            with
            <Image
              src={"/logo2.png"} // App logo
              alt="FlowBoard Logo"
              width={400}
              height={80}
              className="h-14 sm:h-24 w-auto object-contain"
            />
          </span>
        </h1>

        <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Empower your team with my project management solution.
        </p>

        {/* Call to action buttons */}
        <Link href="/onboarding">
          <Button size="lg" className="mr-4">
            Get Started <ChevronRight size={18} className="ml-1" />
          </Button>
        </Link>

        <Link href="#features">
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </Link>
      </section>

      {/* ----------------- Features Section ----------------- */}
      <section id="features" className="bg-gray-900 py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl text-white font-bold mb-12 text-center">
            Key Features
          </h3>

          {/* Grid of feature cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 mb-4 text-blue-300" />
                  <h4 className="text-xl text-white font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}