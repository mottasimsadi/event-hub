import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/db';

// Helper function to validate ObjectId
function isValidObjectId(id: string) {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}

// GET booking count for a specific event (public endpoint - no auth required)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    
    // Validate ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid event ID' },
        { status: 400 }
      );
    }
    
    // Get events collection to verify event exists
    const eventsCollection = await getCollection('events');
    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Get bookings collection
    const bookingsCollection = await getCollection('bookings');
    
    // Get all bookings for this event
    const bookings = await bookingsCollection
      .find({ eventId: id })
      .toArray();
    
    // Calculate total attendees
    const totalAttendees = bookings.reduce(
      (total, booking) => total + (booking.attendees || 1),
      0
    );
    
    // Calculate available seats
    const availableSeats = event.capacity ? event.capacity - totalAttendees : null;
    
    return NextResponse.json({
      totalBookings: bookings.length,
      totalAttendees,
      capacity: event.capacity || null,
      availableSeats,
      isUnlimited: !event.capacity
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching booking count:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}