import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/jwt';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the search query from the URL
    const searchQuery = request.nextUrl.searchParams.get('query');
    if (!searchQuery) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Connect to the database
    const db = await connectToDatabase();
    const bookingsCollection = db.collection('bookings');
    const eventsCollection = db.collection('events');

    // First, find events that match the search query
    const matchingEvents = await eventsCollection.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ],
    }).project({ _id: 1 }).toArray();

    const eventIds = matchingEvents.map(event => event._id);

    // Create a query to find bookings
    const query = {
      $or: [
        // Bookings for events that match the search query
        { eventId: { $in: eventIds } },
        // Bookings with attendee info matching the search query
        { 'attendeeInfo.name': { $regex: searchQuery, $options: 'i' } },
        { 'attendeeInfo.email': { $regex: searchQuery, $options: 'i' } },
      ],
      // Only show bookings created by the current user
      userId: user.id
    };

    // Execute the search query
    const bookings = await bookingsCollection.find(query).limit(10).toArray();

    // Fetch event details for each booking
    const bookingsWithEventDetails = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.eventId) {
          const event = await eventsCollection.findOne({ _id: new ObjectId(booking.eventId) });
          return { ...booking, event };
        }
        return booking;
      })
    );

    return NextResponse.json(bookingsWithEventDetails);
  } catch (error) {
    console.error('Error searching bookings:', error);
    return NextResponse.json({ error: 'Failed to search bookings' }, { status: 500 });
  }
}