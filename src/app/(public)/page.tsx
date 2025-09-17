"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaUsers,
  FaChartLine,
  FaMobileAlt,
} from "react-icons/fa";
import Image from "next/image";

export default function Home() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Event Organizer",
      content:
        "Event Hub has transformed how I manage my events. The platform is intuitive and the analytics help me make better decisions.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      gender: "female",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Conference Director",
      content:
        "I've used many event platforms, but Event Hub stands out with its powerful features and excellent customer support.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      gender: "male",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Marketing Manager",
      content:
        "The booking system is seamless and our attendees love how easy it is to register for our events through Event Hub.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      gender: "female",
    },
  ];

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

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Event Success
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to create, manage, and grow your events
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <FaCalendarAlt size={36} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Easy Event Creation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create and customize your events in minutes with our intuitive
                event builder.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <FaTicketAlt size={36} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Seamless Booking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Provide a frictionless booking experience for your attendees
                with our streamlined checkout.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <FaChartLine size={36} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Detailed Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gain insights into your event performance with comprehensive
                analytics and reporting.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <FaMapMarkerAlt size={36} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Location Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Manage physical and virtual event locations with integrated maps
                and directions.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <FaUsers size={36} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Attendee Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track registrations, send communications, and manage your
                attendee list effortlessly.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">
                <FaMobileAlt size={36} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Mobile Optimized
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fully responsive design ensures a great experience on any
                device, anywhere.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get started with Event Hub in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 dark:text-blue-300 text-2xl font-bold">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Create Your Event
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign up and use our intuitive event builder to create your event
                with all the details.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 dark:text-blue-300 text-2xl font-bold">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Customize & Publish
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Set ticket types, prices, and customize your event page before
                publishing it live.
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <span className="text-blue-600 dark:text-blue-300 text-2xl font-bold">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Manage & Grow
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track bookings, communicate with attendees, and use analytics to
                improve future events.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Trusted by event organizers around the world
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar}
                      alt={`${testimonial.name}'s avatar`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  {testimonial.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
