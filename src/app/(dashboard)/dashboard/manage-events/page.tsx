"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  FaPlus,
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { toast } from "sonner";

type Event = {
  _id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location: string;
  capacity?: number;
  status?: string;
  userId: string;
  createdBy?: {
    name: string;
    email: string;
  };
};

export default function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
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
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data.events || []);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching events");
      } finally {
        setLoading(false);
      }
    }

    if (user?.role === "admin") {
      fetchEvents();
    }
  }, [user]);

  const handleDeleteEvent = async (eventId: string) => {
    // Show confirmation dialog using Sonner toast
    toast.info(
      <div className="flex flex-col space-y-2">
        <p className="font-medium">
          Are you sure you want to delete this event? This action cannot be
          undone.
        </p>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              toast.dismiss();

              // Use Sonner toast for deletion progress
              toast.promise(
                async () => {
                  const response = await fetch(`/api/events/${eventId}`, {
                    method: "DELETE",
                  });

                  if (!response.ok) {
                    throw new Error("Failed to delete event");
                  }

                  // Remove the deleted event from the state
                  setEvents(events.filter((event) => event._id !== eventId));
                  return "Event deleted successfully";
                },
                {
                  loading: "Deleting event...",
                  success: "Event deleted successfully",
                  error: (err) =>
                    err.message || "An error occurred while deleting the event",
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
            Manage Events
          </h1>
        </div>

        {/* Events List */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          {events.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {events.map((event) => (
                <li key={event._id}>
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
                          <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span>{event.location}</span>
                            <span className="mx-2">•</span>
                            <FaClock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span>
                              {event.date ? (
                                <>
                                  <span className="font-medium">Date:</span>{" "}
                                  {new Date(event.date).toLocaleDateString()}
                                  {event.time && (
                                    <>
                                      <span className="mx-1">|</span>
                                      <span className="font-medium">
                                        Time:
                                      </span>{" "}
                                      {event.time}
                                    </>
                                  )}
                                </>
                              ) : (
                                "Date not available"
                              )}
                            </span>
                            <span className="mx-2">•</span>
                            <FaUsers className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
                            <span>
                              Capacity: {event.capacity || "Unlimited"}
                            </span>
                          </div>
                          {event.createdBy && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Created by: {event.createdBy.name} (
                              {event.createdBy.email})
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/events/edit/${event._id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaEdit className="-ml-0.5 mr-1 h-4 w-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
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
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                No events found
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
