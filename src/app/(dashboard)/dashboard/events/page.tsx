"use client";

import Link from "next/link";
import {
  FaPlus,
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/providers/AuthProvider";
import Loading from "@/components/ui/loading";

type Event = {
  _id: { toString: () => string };
  title: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  capacity?: number;
  status?: string;
};

export default function EventsPage() {
  const { user, loading } = useContext(AuthContext);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events/my-events");
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
      fetchEvents();
    }
  }, [user]); // Re-fetch events when user state changes

  if (isLoading || loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Events
          </h1>
          {user ? (
            <Link
              href="/dashboard/events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="-ml-1 mr-2 h-4 w-4" />
              Create Event
            </Link>
          ) : (
            <Link
              href="/login?callbackUrl=/dashboard/events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="-ml-1 mr-2 h-4 w-4" />
              Sign in to Create Events
            </Link>
          )}
        </div>

        {/* Events List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          {events.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {events.map((event) => (
                <li key={event._id.toString()}>
                  <Link
                    href={`/dashboard/events/${event._id}`}
                    className="block hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <FaCalendarAlt className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {event.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {event.description?.substring(0, 100)}...
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                            {event.status || "Active"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            {event.location}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 sm:ml-6">
                            <FaUsers className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            {event.capacity || "Unlimited"} attendees
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                          <FaClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                          <p>
                            {new Date(event.date).toLocaleDateString()} at{" "}
                            {event.time || "00:00"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No events
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new event.
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard/events/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Event
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
