import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/jwt';

// GET all bookings for the current user or all bookings for admin
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get bookings collection
    const bookingsCollection = await getCollection('bookings');
    const eventsCollection = await getCollection('events');
    const usersCollection = await getCollection('users');
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    
    // Build query - for admin show all bookings, for regular users show only their bookings
    let query: any = {};
    if (user.role !== 'admin' || !request.headers.get('referer')?.includes('/dashboard')) {
      query.userId = user.id;
    }
    
    if (eventId) {
      query.eventId = eventId;
    }
    
    // Get bookings
    const bookings = await bookingsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    // Enhance bookings with event details and user details (for admin)
    const enhancedBookings = await Promise.all(
      bookings.map(async (booking) => {
        // Get event details
        let event = null;
        try {
          event = await eventsCollection.findOne({ _id: new ObjectId(booking.eventId) });
        } catch (error) {
          console.error('Error fetching event:', error);
        }
        
        // For admin, get user details
        let bookingUser = null;
        if (user.role === 'admin' && booking.userId) {
          try {
            bookingUser = await usersCollection.findOne({ 
              $or: [
                { id: booking.userId },
                { _id: new ObjectId(booking.userId) }
              ].filter(id => id)
            });
          } catch (error) {
            console.error('Error fetching booking user:', error);
          }
        }
        
        return {
          ...booking,
          event: event ? {
            _id: event._id,
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            image: event.image,
          } : null,
          user: bookingUser && user.role === 'admin' ? {
            name: bookingUser.name,
            email: bookingUser.email
          } : null,
        };
      })
    );
    
    return NextResponse.json({ bookings: enhancedBookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new booking
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get request body
    const { eventId, attendees = 1 } = await request.json();
    
    // Validate required fields
    if (!eventId) {
      return NextResponse.json(
        { message: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    // Validate ObjectId
    if (!ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { message: 'Invalid event ID' },
        { status: 400 }
      );
    }
    
    // Get events collection
    const eventsCollection = await getCollection('events');
    
    // Find event
    const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
    
    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Check if event has capacity
    if (event.capacity) {
      // Get bookings collection to count existing bookings
      const bookingsCollection = await getCollection('bookings');
      const existingBookingsCount = await bookingsCollection.countDocuments({ eventId });
      
      if (existingBookingsCount + attendees > event.capacity) {
        return NextResponse.json(
          { message: 'Event is at full capacity' },
          { status: 400 }
        );
      }
    }
    
    // Check if the event was created by the current user
    if (event.createdBy === user.id) {
      return NextResponse.json(
        { message: 'You cannot book your own event' },
        { status: 400 }
      );
    }
    
    // Check if user already has a booking for this event
    const bookingsCollection = await getCollection('bookings');
    const existingBooking = await bookingsCollection.findOne({
      userId: user.id,
      eventId,
    });
    
    if (existingBooking) {
      return NextResponse.json(
        { message: 'You have already booked this event' },
        { status: 400 }
      );
    }
    
    // Create booking
    const newBooking = {
      userId: user.id,
      eventId: event._id.toString(), // Ensure we store the correct event ID
      attendees,
      status: 'confirmed',
      createdAt: new Date(),
    };
    
    const result = await bookingsCollection.insertOne(newBooking);
    
    return NextResponse.json(
      { 
        message: 'Booking created successfully',
        bookingId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}