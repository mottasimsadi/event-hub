"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Create Unforgettable Events
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              The all-in-one platform for event creation, management, and
              booking
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-md font-medium text-lg transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/events"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-md font-medium text-lg transition-colors"
              >
                Explore Events
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/30"></div>
          <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-white/20"></div>
          <div className="absolute bottom-0 left-1/3 w-60 h-60 rounded-full bg-white/20"></div>
        </div>
      </section>
    </div>
  );
}
