import { getCurrentUser } from "@/lib/auth/jwt";
import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";
import Link from "next/link";
import {
  FaCalendarAlt,
  FaTicketAlt,
  FaChartLine,
} from "react-icons/fa";

async function getDashboardStats() {
  try {
    const eventsCollection = await getCollection("events");
    const bookingsCollection = await getCollection("bookings");

    // Get total events count
    const totalEvents = await eventsCollection.countDocuments();

    // Get total bookings count
    const totalBookings = await bookingsCollection.countDocuments();

    // Get upcoming events (events with date in the future)
    const upcomingEvents = await eventsCollection.countDocuments({
      date: { $gte: new Date() },
    });

    // Get recent bookings (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const recentBookings = await bookingsCollection.countDocuments({
      createdAt: { $gte: lastWeek },
    });

    return {
      totalEvents,
      totalBookings,
      upcomingEvents,
      recentBookings,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalEvents: 0,
      totalBookings: 0,
      upcomingEvents: 0,
      recentBookings: 0,
    };
  }
}

async function getRecentEvents(limit = 5) {
  try {
    const eventsCollection = await getCollection("events");

    // Get recent events
    const events = await eventsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return events;
  } catch (error) {
    console.error("Error fetching recent events:", error);
    return [];
  }
}

async function getUserEvents(userId, limit = 3) {
  try {
    const eventsCollection = await getCollection("events");

    // Get user's events - using createdBy field instead of userId
    console.log("Fetching events for user ID:", userId);
    const events = await eventsCollection
      .find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    console.log("Found events:", events.length);
    return events;
  } catch (error) {
    console.error("Error fetching user events:", error);
    return [];
  }
}

async function getRecentBookings(limit = 5) {
  try {
    const bookingsCollection = await getCollection("bookings");
    const usersCollection = await getCollection("users");
    const eventsCollection = await getCollection("events");

    // Get recent bookings
    const bookings = await bookingsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    // Enhance bookings with user and event data
    const enhancedBookings = await Promise.all(
      bookings.map(async (booking) => {
        // Convert string IDs to ObjectId for proper querying
        let userId, eventId;

        try {
          userId = new ObjectId(booking.userId);
        } catch (e) {
          console.error("Invalid userId format:", booking.userId);
          userId = null;
        }

        try {
          eventId = new ObjectId(booking.eventId);
        } catch (e) {
          console.error("Invalid eventId format:", booking.eventId);
          eventId = null;
        }

        // Query with ObjectId or null if conversion failed
        const user = userId
          ? await usersCollection.findOne({ _id: userId })
          : null;
        const event = eventId
          ? await eventsCollection.findOne({ _id: eventId })
          : null;

        return {
          ...booking,
          userName: user?.name || "Unknown User",
          eventTitle: event?.title || "Unknown Event",
        };
      })
    );

    return enhancedBookings;
  } catch (error) {
    console.error("Error fetching recent bookings:", error);
    return [];
  }
}


// Admin Dashboard Component
function AdminDashboard({ user, stats, recentEvents, recentBookings }) {
  const statCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: <FaCalendarAlt className="w-6 h-6 text-blue-500" />,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: <FaTicketAlt className="w-6 h-6 text-green-500" />,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-700 dark:text-green-300",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: <FaCalendarAlt className="w-6 h-6 text-purple-500" />,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-700 dark:text-purple-300",
    },
    {
      title: "Recent Bookings",
      value: stats.recentBookings,
      icon: <FaChartLine className="w-6 h-6 text-orange-500" />,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-700 dark:text-orange-300",
    },
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Welcome back, {user?.name}!
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`${stat.bgColor} p-6 rounded-lg shadow-sm`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">{stat.icon}</div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.title}
                    </dt>
                    <dd>
                      <div
                        className={`text-lg font-semibold ${stat.textColor}`}
                      >
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Events and Bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Recent Events
              </h3>
            </div>
            <div className="p-6">
              {recentEvents.length > 0 ? (
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentEvents.map((event) => (
                      <li key={event._id.toString()} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-md bg-blue-500 flex items-center justify-center text-white">
                              <FaCalendarAlt />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {event.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <a
                              href={`/dashboard/events/${event._id}`}
                              className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 dark:border-gray-600 text-sm leading-5 font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No events found. Create your first event!
                </p>
              )}
              <div className="mt-6">
                <Link
                  href="/dashboard/events"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  View all events
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Recent Bookings
              </h3>
            </div>
            <div className="p-6">
              {recentBookings && recentBookings.length > 0 ? (
                <div className="flow-root">
                  <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentBookings.map((booking) => (
                      <li key={booking._id.toString()} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-md bg-green-500 flex items-center justify-center text-white">
                              <FaTicketAlt />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {booking.eventTitle}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              Booked by: {booking.userName}
                            </p>
                          </div>
                          <div>
                            <Link
                              href={`/dashboard/bookings/${booking._id}`}
                              className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 dark:border-gray-600 text-sm leading-5 font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    No bookings found yet.
                  </p>
                </div>
              )}
              <div className="mt-6">
                <Link
                  href="/dashboard/bookings"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  View all bookings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// User Dashboard Component
function UserDashboard({ user, userEvents }) {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Welcome back, {user?.name}!
        </h1>

        {/* User's Events */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              My Recent Events
            </h3>
          </div>
          <div className="p-6">
            {userEvents && userEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userEvents.map((event) => (
                  <div
                    key={event._id.toString()}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm"
                  >
                    <div className="p-4">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 truncate">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex justify-end">
                        <Link
                          href={`/dashboard/events/${event._id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You haven&apos;t created any events yet.
                </p>
                <Link
                  href="/dashboard/events/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Event
                </Link>
              </div>
            )}

            {userEvents && userEvents.length > 0 && (
              <div className="mt-6 flex justify-between">
                <Link
                  href="/dashboard/events"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  View All Events
                </Link>
                <Link
                  href="/dashboard/events/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Event
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Page Component
export default async function DashboardPage() {
  const user = await getCurrentUser();

  // If user is admin, fetch admin dashboard data
  if (user?.role === "admin") {
    const stats = await getDashboardStats();
    const recentEvents = await getRecentEvents();
    const recentBookings = await getRecentBookings();

    return (
      <AdminDashboard
        user={user}
        stats={stats}
        recentEvents={recentEvents}
        recentBookings={recentBookings}
      />
    );
  }
  // Otherwise, fetch user dashboard data
  else {
    const userEvents = await getUserEvents(user.id);

    return <UserDashboard user={user} userEvents={userEvents} />;
  }
}
