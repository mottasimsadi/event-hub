"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends,
  FaArrowLeft,
} from "react-icons/fa";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  image?: string;
  price: number;
  organizer: string;
  capacity?: number;
  category?: string;
  createdBy: string;
}

export default function CreateBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const { user: currentUser } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!eventId) {
      setError("No event selected");
      setIsLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }

        const data = await response.json();
        setEvent(data.event);
      } catch (err) {
        setError("Error loading event details. Please try again.");
        console.error("Error fetching event:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleCreateBooking = async () => {
    if (!event) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: event._id,
          attendees,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create booking");
      }

      toast.success("Booking created successfully!", {
        description: `You have booked ${attendees} ticket(s) for ${event.title}`,
      });

      // Redirect to booking details page
      router.push(`/dashboard/bookings/${data.bookingId}`);
    } catch (err: any) {
      setError(err.message || "Error creating booking. Please try again.");
      console.error("Error creating booking:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Link
            href="/dashboard/bookings"
            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Bookings
          </Link>
        </div>

        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Browse Events
        </Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Link
            href="/dashboard/bookings"
            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Bookings
          </Link>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700 dark:text-yellow-400">
            Event not found
          </p>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Browse Events
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "PPP");

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link
          href={
            currentUser?.role === "admin"
              ? "/dashboard/manage-events"
              : "/events"
          }
          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
        >
          <FaArrowLeft className="mr-2" />{" "}
          {currentUser?.role === "admin"
            ? "Back to Manage Events"
            : "Back to Events"}
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Event Image */}
        {event.image ? (
          <div className="h-64 w-full overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-64 w-full overflow-hidden">
            <Image
              src={`https://picsum.photos/seed/event-${event._id}/800/400`}
              alt={event.title}
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Event Details */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Book Tickets: {event.title}
          </h1>

          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
            <FaCalendarAlt className="mr-2" />
            {formattedDate}
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
            <FaMapMarkerAlt className="mr-2" />
            {event.location}
          </div>

          {event.description && (
            <div className="mb-6 text-gray-600 dark:text-gray-300">
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                Event Description
              </h3>
              <p>{event.description}</p>
            </div>
          )}

          {/* Booking Form */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Booking Details
            </h3>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="attendees"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Number of Tickets
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setAttendees((prev) => Math.max(1, prev - 1))}
                  className="inline-flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-l-md text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none"
                >
                  -
                </button>
                <input
                  type="number"
                  id="attendees"
                  name="attendees"
                  min="1"
                  max={event.capacity || 100}
                  value={attendees}
                  onChange={(e) =>
                    setAttendees(
                      Math.max(
                        1,
                        Math.min(
                          event.capacity || 100,
                          parseInt(e.target.value) || 1
                        )
                      )
                    )
                  }
                  className="p-2 block w-full border-y border-gray-300 dark:border-gray-600 text-center text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setAttendees((prev) =>
                      Math.min(event.capacity || 100, prev + 1)
                    )
                  }
                  className="inline-flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none"
                >
                  +
                </button>
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <FaUserFriends className="mr-1" />
                {event.capacity
                  ? `${attendees} of ${event.capacity} available`
                  : "No capacity limit"}
              </div>
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleCreateBooking}
                disabled={isSubmitting}
                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Booking..." : "Confirm Booking"}
              </button>

              <Link
                href="/events"
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
