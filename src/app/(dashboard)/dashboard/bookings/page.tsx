import { getCollection } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/jwt";
import { ObjectId } from "mongodb";
import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import { format } from "date-fns";

async function getBookings() {
  const user = await getCurrentUser();
  if (!user) return [];

  try {
    const bookingsCollection = await getCollection("bookings");
    const bookings = await bookingsCollection
      .find({ userId: user.id })
      .sort({ createdAt: -1 })
      .toArray();

    // Get event details for each booking
    const eventsCollection = await getCollection("events");
    const enhancedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const event = await eventsCollection.findOne({
          _id: new ObjectId(booking.eventId),
        });
        return {
          ...booking,
          event: event || null,
        };
      })
    );

    return enhancedBookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          My Bookings
        </h1>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
          <FaTicketAlt className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            No bookings yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven&apos;t booked any events yet. Browse events to find
            something interesting!
          </p>
          <Link
            href="/events"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id.toString()}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col"
            >
              {booking.event?.image ? (
                <div className="h-48 w-full overflow-hidden">
                  <Image
                    src={booking.event.image}
                    alt={booking.event.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-48 w-full overflow-hidden">
                  <Image
                    src={`https://picsum.photos/seed/event-${
                      booking.event?._id || booking._id
                    }/400/200`}
                    alt={booking.event?.title || "Event"}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {booking.event?.title || "Event no longer available"}
                </h3>

                {booking.event ? (
                  <>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <FaCalendarAlt className="mr-2" />
                      {format(new Date(booking.event.date), "PPP")}
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <FaMapMarkerAlt className="mr-2" />
                      {booking.event.location}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-red-500 mb-4">
                    This event has been removed
                  </p>
                )}

                <div className="mt-auto">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tickets: {booking.attendees || 1}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status || "confirmed"
                        )}`}
                      >
                        {capitalizeFirstLetter(booking.status || "confirmed")}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    {booking.event && (
                      <Link
                        href={`/events/${booking.event._id}`}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Event
                      </Link>
                    )}

                    <Link
                      href={`/dashboard/bookings/${booking._id}`}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Manage Booking
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
