"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserFriends,
  FaTrash,
} from "react-icons/fa";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";

interface Booking {
  _id: string;
  userId: string;
  eventId: string;
  attendees: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  event?: {
    _id: string;
    title: string;
    date: string;
    location: string;
    image?: string;
    description?: string;
    capacity?: number;
  };
}

export default function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [attendees, setAttendees] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  function decreaseAttendees() {
    setAttendees(Math.max(1, attendees - 1));
  }

  function increaseAttendees() {
    setAttendees(Math.min(booking?.event?.capacity || 100, attendees + 1));
  }

  function handleAttendeesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAttendees(Math.max(1, parseInt(e.target.value) || 1));
  }

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch booking details");
        }

        const data = await response.json();
        setBooking(data.booking);
        setAttendees(data.booking.attendees || 1);
      } catch (err) {
        setError("Error loading booking details. Please try again.");
        console.error("Error fetching booking:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleUpdateBooking = async () => {
    if (!booking) return;

    setIsUpdating(true);
    setError("");
    setUpdateSuccess(false);

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attendees }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update booking");
      }

      setUpdateSuccess(true);

      // Refresh booking data
      const updatedResponse = await fetch(`/api/bookings/${id}`);
      const updatedData = await updatedResponse.json();
      setBooking(updatedData.booking);
    } catch (err: any) {
      setError(err.message || "Error updating booking. Please try again.");
      console.error("Error updating booking:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    toast(
      <div className="flex flex-col space-y-2">
        <p className="font-medium">
          Are you sure you want to cancel this booking? This action cannot be
          undone.
        </p>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              toast.dismiss();
              setIsCancelling(true);
              setError("");

              try {
                const response = await fetch(`/api/bookings/${id}`, {
                  method: "DELETE",
                });

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(
                    errorData.message || "Failed to cancel booking"
                  );
                }

                toast.success("Booking cancelled successfully");
                router.push("/dashboard/bookings");
              } catch (err: any) {
                setError(
                  err.message || "Error cancelling booking. Please try again."
                );
                toast.error(
                  err.message || "Error cancelling booking. Please try again."
                );
                console.error("Error cancelling booking:", err);
              } finally {
                setIsCancelling(false);
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
          >
            Yes, cancel booking
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
          >
            Keep booking
          </button>
        </div>
      </div>,
      {
        duration: 5000,
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700 dark:text-yellow-400">
            Booking not found
          </p>
        </div>
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link
          href="/dashboard/bookings"
          className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center"
        >
          &larr; Back to Bookings
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Event Image */}
        {booking.event?.image ? (
          <div className="h-64 w-full overflow-hidden">
            <Image
              src={booking.event.image}
              alt={booking.event.title}
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-64 w-full overflow-hidden">
            <Image
              src={`https://picsum.photos/seed/event-${
                booking.event?._id || booking._id
              }/800/400`}
              alt={booking.event?.title || "Event"}
              width={800}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Booking Details */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {booking.event?.title || "Event no longer available"}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                booking.status
              )}`}
            >
              {capitalizeFirstLetter(booking.status)}
            </span>
          </div>

          {booking.event ? (
            <>
              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                <FaCalendarAlt className="mr-2" />
                {format(new Date(booking.event.date), "PPP")}
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                <FaMapMarkerAlt className="mr-2" />
                {booking.event.location}
              </div>

              {booking.event.description && (
                <div className="mb-6 text-gray-600 dark:text-gray-300">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                    Event Description
                  </h3>
                  <p>{booking.event.description}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-red-500 mb-4">
              This event has been removed or is no longer available.
            </p>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Booking Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Booking ID
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {booking._id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Booking Date
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {format(new Date(booking.createdAt), "PPP")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Number of Tickets
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {booking.attendees || 1}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status
                </p>
                <p className="font-medium text-gray-800 dark:text-white">
                  {capitalizeFirstLetter(booking.status)}
                </p>
              </div>
            </div>

            {/* Update Booking Section */}
            {booking.status !== "cancelled" && booking.event && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  Update Booking
                </h3>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
                    <p className="text-red-700 dark:text-red-400">{error}</p>
                  </div>
                )}

                {updateSuccess && (
                  <div className="bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-4 mb-4">
                    <p className="text-green-700 dark:text-green-400">
                      Booking updated successfully!
                    </p>
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
                      onClick={decreaseAttendees}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      disabled={attendees <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="attendees"
                      value={attendees}
                      onChange={handleAttendeesChange}
                      min="1"
                      max={booking.event.capacity || 100}
                      className="p-2 w-16 text-center border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    />
                    <button
                      type="button"
                      onClick={increaseAttendees}
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      disabled={attendees >= (booking.event?.capacity || 100)}
                    >
                      +
                    </button>
                    <div className="ml-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FaUserFriends className="mr-1" />
                      {booking.event.capacity
                        ? `${attendees} of ${booking.event.capacity} available`
                        : "No capacity limit"}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleUpdateBooking}
                    disabled={isUpdating || attendees === booking.attendees}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? "Updating..." : "Update Booking"}
                  </button>

                  <button
                    onClick={handleCancelBooking}
                    disabled={isCancelling}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaTrash className="mr-2" />
                    {isCancelling ? "Cancelling..." : "Cancel Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
