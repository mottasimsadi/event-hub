"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  FaChartLine,
  FaCalendarAlt,
  FaUsers,
  FaTicketAlt,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface AnalyticsData {
  totalEvents: number;
  totalBookings: number;
  upcomingEvents: number;
  recentBookings: number;
  eventsByMonth: {
    month: string;
    count: number;
  }[];
  bookingsByMonth: {
    month: string;
    count: number;
  }[];
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
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
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err: any) {
        setError(
          err.message || "An error occurred while fetching analytics data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

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

  if (!analyticsData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Notice: </strong>
          <span className="block sm:inline">No analytics data available.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <FaChartLine className="mr-2" /> Analytics Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 dark:text-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Total Events
              </p>
              <h2 className="text-3xl font-bold">
                {analyticsData.totalEvents}
              </h2>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaCalendarAlt className="text-blue-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 dark:text-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Total Bookings
              </p>
              <h2 className="text-3xl font-bold">
                {analyticsData.totalBookings}
              </h2>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaTicketAlt className="text-green-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 dark:text-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Upcoming Events
              </p>
              <h2 className="text-3xl font-bold">
                {analyticsData.upcomingEvents}
              </h2>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaCalendarAlt className="text-purple-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 dark:text-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Recent Bookings
              </p>
              <h2 className="text-3xl font-bold">
                {analyticsData.recentBookings}
              </h2>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FaUsers className="text-orange-500 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 dark:text-gray-100">
          <h3 className="text-xl font-semibold mb-4">
            Events by Month (Last 12 Months)
          </h3>
          <div className="h-80 w-full">
            {typeof window !== "undefined" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.eventsByMonth}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    strokeOpacity={0.2}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "currentColor" }}
                    axisLine={{ stroke: "#374151", strokeOpacity: 0.3 }}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: "currentColor" }}
                    axisLine={{ stroke: "#374151", strokeOpacity: 0.3 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.8)",
                      border: "none",
                      borderRadius: "4px",
                      color: "#f3f4f6",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "currentColor" }} />
                  <Bar
                    dataKey="count"
                    name="Events"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    minPointSize={5}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 dark:text-gray-100">
          <h3 className="text-xl font-semibold mb-4">
            Bookings by Month (Last 12 Months)
          </h3>
          <div className="h-80 w-full">
            {typeof window !== "undefined" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={analyticsData.bookingsByMonth}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#374151"
                    strokeOpacity={0.2}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "currentColor" }}
                    axisLine={{ stroke: "#374151", strokeOpacity: 0.3 }}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: "currentColor" }}
                    axisLine={{ stroke: "#374151", strokeOpacity: 0.3 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.8)",
                      border: "none",
                      borderRadius: "4px",
                      color: "#f3f4f6",
                    }}
                  />
                  <Legend wrapperStyle={{ color: "currentColor" }} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Bookings"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 1 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
