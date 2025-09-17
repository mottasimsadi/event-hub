import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/jwt";
import { getCollection } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get collections
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

    // Get events by month (last 12 months)
    const eventsByMonth = await getEventsByMonth(eventsCollection);

    // Get bookings by month (last 12 months)
    const bookingsByMonth = await getBookingsByMonth(bookingsCollection);

    return NextResponse.json({
      totalEvents,
      totalBookings,
      upcomingEvents,
      recentBookings,
      eventsByMonth,
      bookingsByMonth,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}

async function getEventsByMonth(collection: any) {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1); // Start of month

  const pipeline = [
    {
      $match: {
        date: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const results = await collection.aggregate(pipeline).toArray();

  // Create an array of the last 12 months
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    // Use a fixed array of month abbreviations to ensure consistency
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    months.unshift({
      yearMonth: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`,
      month: monthNames[date.getMonth()],
      count: 0,
    });
  }

  // Map the results to the months array
  results.forEach((item: any) => {
    const monthIndex = months.findIndex((m) => m.yearMonth === item._id);
    if (monthIndex !== -1) {
      months[monthIndex].count = item.count;
    }
  });

  // Return only the month and count properties
  return months.map((item) => ({
    month: item.month,
    count: item.count,
  }));
}

async function getBookingsByMonth(collection: any) {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1); // Start of month

  const pipeline = [
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const results = await collection.aggregate(pipeline).toArray();

  // Create an array of the last 12 months
  const months = [];
  const currentDate = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    // Use a fixed array of month abbreviations to ensure consistency
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    months.unshift({
      yearMonth: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`,
      month: monthNames[date.getMonth()],
      count: 0,
    });
  }

  // Map the results to the months array
  results.forEach((item: any) => {
    const monthIndex = months.findIndex((m) => m.yearMonth === item._id);
    if (monthIndex !== -1) {
      months[monthIndex].count = item.count;
    }
  });

  // Return only the month and count properties
  return months.map((item) => ({
    month: item.month,
    count: item.count,
  }));
}
