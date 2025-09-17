"use client";

import Image from "next/image";
import Link from "next/link";
import { FaUsers, FaCalendarCheck, FaHandshake } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3 mr-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
              </svg>
              Home
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                About
              </span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Event Hub
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          We are on a mission to bring people together through memorable events
          and experiences.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Story
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Founded in 2020, Event Hub began with a simple idea: to make event
            planning and discovery seamless and accessible to everyone. What
            started as a small team of passionate event enthusiasts has grown
            into a platform that connects thousands of people to events they
            love.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Our platform brings together event organizers and attendees,
            creating a vibrant community where experiences are shared and
            memories are made. We believe in the power of events to inspire,
            educate, and bring joy to people&apos;s lives.
          </p>
          <div className="flex items-center space-x-2">
            <div className="h-1 w-10 bg-blue-600 dark:bg-blue-400 rounded"></div>
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              Established 2020
            </p>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative rounded-lg overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
            <Image
              src="https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Event Hub Conference"
              width={600}
              height={400}
              className="object-cover w-full h-80 rounded-lg transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <p className="text-white text-lg font-medium">
                Our first major conference - 2021
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
              <FaUsers className="text-blue-600 dark:text-blue-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Community First
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We believe in the power of bringing people together and fostering
              meaningful connections through events.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
              <FaCalendarCheck className="text-blue-600 dark:text-blue-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Quality Experiences
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We&apos;re committed to helping organizers create exceptional
              events and attendees discover experiences they&apos;ll love.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
              <FaHandshake className="text-blue-600 dark:text-blue-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Trust & Reliability
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We prioritize building trust with our users through transparent
              practices and reliable service.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">
          Our Leadership Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transform transition-all hover:scale-105 hover:shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 relative">
              <Image
                src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                alt="John Smith"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                John Smith
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-4">
                CEO & Co-Founder
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                With over 15 years in the events industry, John leads our vision
                and strategy.
              </p>
              <div className="mt-4 flex justify-center space-x-3">
                <a
                  href="https://www.x.com/"
                  target="_blank"
                  className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zM16.684 20.74h2.04L7.478 3.31H5.3l11.384 17.43z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  className="text-blue-700 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transform transition-all hover:scale-105 hover:shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 relative">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80"
                alt="Sarah Johnson"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                Sarah Johnson
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-4">
                CTO & Co-Founder
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Sarah oversees our technical strategy and product development.
              </p>
              <div className="mt-4 flex justify-center space-x-3">
                <a
                  href="https://www.x.com/"
                  target="_blank"
                  className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zM16.684 20.74h2.04L7.478 3.31H5.3l11.384 17.43z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  className="text-blue-700 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transform transition-all hover:scale-105 hover:shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 relative">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
                alt="Michael Chen"
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                Michael Chen
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-4">
                Head of Operations
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Michael ensures our platform runs smoothly and efficiently for
                all users.
              </p>
              <div className="mt-4 flex justify-center space-x-3">
                <a
                  href="https://www.x.com/"
                  target="_blank"
                  className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H1.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zM16.684 20.74h2.04L7.478 3.31H5.3l11.384 17.43z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  className="text-blue-700 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl p-10 mb-20 shadow-lg border border-blue-200 dark:border-blue-800">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Event Hub by the Numbers
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Our platform continues to grow as we connect more people with amazing
          events around the world.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-xl border-t-4 border-blue-500">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <FaCalendarCheck className="text-blue-600 dark:text-blue-400 text-3xl" />
            </div>
            <p className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2 animate-pulse">
              10,000+
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Events Hosted
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              From conferences to workshops
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-xl border-t-4 border-indigo-500">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
              <FaUsers className="text-indigo-600 dark:text-indigo-400 text-3xl" />
            </div>
            <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 animate-pulse">
              500,000+
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Happy Attendees
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Creating memorable experiences
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-xl border-t-4 border-purple-500">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
              <FaHandshake className="text-purple-600 dark:text-purple-400 text-3xl" />
            </div>
            <p className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2 animate-pulse">
              50+
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Countries Reached
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Global community of event lovers
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-xl border-t-4 border-teal-500">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full mb-4">
              <svg
                className="text-teal-600 dark:text-teal-400 text-3xl"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 6V12L16 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-5xl font-bold text-teal-600 dark:text-teal-400 mb-2 animate-pulse">
              24/7
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Customer Support
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Always here when you need us
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300 italic">
            &quot;Connecting people through exceptional events since 2020&quot;
          </p>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Join the Event Hub Community
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Whether you&apos;re organizing events or looking for your next great
          experience, we&apos;re here to help you connect.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/signup"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
          >
            Create an Account
          </a>
          <a
            href="/contact"
            className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors font-medium"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
