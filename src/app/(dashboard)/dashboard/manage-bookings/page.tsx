"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaUser,
  FaTrash,
} from "react-icons/fa";
import { toast } from "sonner";
import { format } from "date-fns";

type Booking = {
  _id: string;
  eventId: string;
  userId: string;
  status: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  event?: {
    title: string;
    date: string;
    time?: string;
    location: string;
    image?: string;
  };
};

export default function ManageBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect non-admin users to dashboard
    if (user && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings");
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching bookings");
      } finally {
        setLoading(false);
      }
    }

    if (user?.role === "admin") {
      fetchBookings();
    }
  }, [user]);

  const handleDeleteBooking = async (bookingId: string) => {
    // Show confirmation dialog using Sonner toast
    toast.info(
      <div className="flex flex-col space-y-2">
        <p className="font-medium">
          Are you sure you want to delete this booking? This action cannot be
          undone.
        </p>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              toast.dismiss();

              // Use Sonner toast for deletion progress
              toast.promise(
                async () => {
                  const response = await fetch(`/api/bookings/${bookingId}`, {
                    method: "DELETE",
                  });

                  if (!response.ok) {
                    throw new Error("Failed to delete booking");
                  }

                  // Remove the deleted booking from the state
                  setBookings(
                    bookings.filter((booking) => booking._id !== bookingId)
                  );
                  return "Booking deleted successfully";
                },
                {
                  loading: "Deleting booking...",
                  success: "Booking deleted successfully",
                  error: (err) =>
                    err.message ||
                    "An error occurred while deleting the booking",
                }
              );
            }}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            Yes, delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        duration: 10000,
        icon: null,
      }
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary dark:border-gray-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Manage Bookings
          </h1>
        </div>

        {/* Bookings List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          {bookings.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map((booking) => (
                <li key={booking._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-md bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <FaTicketAlt className="h-6 w-6 text-green-600 dark:text-green-300" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {booking.event?.title ||
                              "Event no longer available"}
                          </p>
                          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span>{booking.event?.location || "N/A"}</span>
                            <span className="mx-2">•</span>
                            <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span>
                              {booking.event?.date ? (
                                <>
                                  <span className="font-medium">Date:</span>{" "}
                                  {new Date(
                                    booking.event.date
                                  ).toLocaleDateString()}
                                  {booking.event.time && (
                                    <>
                                      <span className="mx-1">|</span>
                                      <span className="font-medium">
                                        Time:
                                      </span>{" "}
                                      {booking.event.time}
                                    </>
                                  )}
                                </>
                              ) : (
                                "Date not available"
                              )}
                            </span>
                          </div>
                          {booking.user && (
                            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <FaUser className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                              <span>
                                Booked by: {booking.user.name} (
                                {booking.user.email})
                              </span>
                            </div>
                          )}
                          <div className="mt-2 flex items-center">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              }`}
                            >
                              {booking.status || "pending"}
                            </span>
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                              Booked on:{" "}
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FaTrash className="-ml-0.5 mr-1 h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                No bookings found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                There are no bookings in the system yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
