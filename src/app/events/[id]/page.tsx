"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaTicketAlt,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "@/components/providers/AuthProvider";
import { toast } from "sonner";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  image: string;
  price: number;
  organizer: string;
  capacity?: number;
  category?: string;
  createdBy: string;
}

export default function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availableSeats, setAvailableSeats] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEventAndBookings() {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }

        const data = await response.json();
        setEvent(data.event);
        
        // Calculate available seats if capacity exists
        if (data.event.capacity) {
          // Fetch bookings count for this event using the public endpoint
          const bookingsResponse = await fetch(`/api/events/${id}/bookings/count`);
          
          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();
            setAvailableSeats(bookingsData.availableSeats);
          }
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching event details"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEventAndBookings();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-gray-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <div className="mt-6">
          <Link
            href="/events"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Notice: </strong>
          <span className="block sm:inline">Event not found.</span>
        </div>
        <div className="mt-6">
          <Link
            href="/events"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FaArrowLeft className="mr-2" /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "EEEE, MMMM d, yyyy");
  const formattedTime = event.time || "00:00";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link
          href="/events"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to Events
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Event Image */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full bg-gray-200 dark:bg-gray-700">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              priority={true}
            />
          ) : (
            <Image
              src={`https://picsum.photos/seed/event-${event._id}/800/400`}
              alt={event.title}
              fill
              className="object-cover"
              priority={true}
            />
          )}

          {event.price === 0 && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              FREE
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">
              {event.title}
            </h1>

            {user ? (
              <button
                onClick={() => {
                  // Check if the event was created by the current user
                  if (event.createdBy === user.id) {
                    toast.error("You cannot book your own event", {
                      description: "Organizers cannot book their own events."
                    });
                    return;
                  }
                  // Navigate to booking page if not the creator
                  router.push(`/dashboard/bookings/create?eventId=${event._id}`);
                }}
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaTicketAlt className="mr-2" />
                Book Now
              </button>
            ) : (
              <Link
                href={`/login?callbackUrl=/events/${event._id}`}
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaUser className="mr-2" />
                Sign in to Book
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-blue-500 dark:text-blue-300 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formattedDate}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mr-4">
                <FaClock className="text-purple-500 dark:text-purple-300 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formattedTime}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
                <FaMapMarkerAlt className="text-green-500 dark:text-green-300 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Location
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {event.location}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full mr-4">
                <FaTicketAlt className="text-red-500 dark:text-red-300 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Available Seats
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {event.capacity ? (
                    availableSeats !== null ? (
                      <span className={availableSeats < 5 ? "text-red-500" : ""}>
                        {availableSeats} of {event.capacity}
                        {availableSeats < 5 && " (Limited!)"}  
                      </span>
                    ) : (
                      "Loading..."
                    )
                  ) : (
                    "Unlimited"
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              About This Event
            </h2>
            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
              <p>{event.description}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mr-4">
                  <FaUser className="text-gray-500 dark:text-gray-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Organized by
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {event.organizer}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Price
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
