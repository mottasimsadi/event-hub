import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCollection } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/jwt';

// Helper function to validate ObjectId
function isValidObjectId(id: string) {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}

// GET single booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Validate ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid booking ID' },
        { status: 400 }
      );
    }
    
    // Get bookings collection
    const bookingsCollection = await getCollection('bookings');
    
    // Find booking
    const booking = await bookingsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!booking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the owner of the booking or an admin
    if (booking.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'You do not have permission to view this booking' },
        { status: 403 }
      );
    }
    
    // Get event details
    const eventsCollection = await getCollection('events');
    const event = await eventsCollection.findOne({ _id: new ObjectId(booking.eventId) });
    
    const enhancedBooking = {
      ...booking,
      event: event ? {
        _id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
        image: event.image,
      } : null,
    };
    
    return NextResponse.json({ booking: enhancedBooking }, { status: 200 });
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Validate ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid booking ID' },
        { status: 400 }
      );
    }
    
    // Get request body
    const { attendees, status } = await request.json();
    
    // Get bookings collection
    const bookingsCollection = await getCollection('bookings');
    
    // Find booking to check ownership
    const existingBooking = await bookingsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!existingBooking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the owner of the booking or an admin
    if (existingBooking.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'You do not have permission to update this booking' },
        { status: 403 }
      );
    }
    
    // If updating attendees, check event capacity
    if (attendees && attendees !== existingBooking.attendees) {
      const eventsCollection = await getCollection('events');
      const event = await eventsCollection.findOne({ _id: new ObjectId(existingBooking.eventId) });
      
      if (event && event.capacity) {
        // Count all attendees for this event excluding this booking
        const otherBookings = await bookingsCollection
          .find({ eventId: existingBooking.eventId, _id: { $ne: new ObjectId(id) } })
          .toArray();
          
        const otherAttendeesCount = otherBookings.reduce((sum, booking) => sum + (booking.attendees || 1), 0);
        
        if (otherAttendeesCount + attendees > event.capacity) {
          return NextResponse.json(
            { message: 'Cannot update booking: event capacity would be exceeded' },
            { status: 400 }
          );
        }
      }
    }
    
    // Update booking
    const updateData: any = { updatedAt: new Date() };
    if (attendees !== undefined) updateData.attendees = attendees;
    if (status !== undefined) updateData.status = status;
    
    const result = await bookingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Booking updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    
    // Validate ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: 'Invalid booking ID' },
        { status: 400 }
      );
    }
    
    // Get bookings collection
    const bookingsCollection = await getCollection('bookings');
    
    // Find booking to check ownership
    const existingBooking = await bookingsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!existingBooking) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Check if user is the owner of the booking or an admin
    if (existingBooking.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { message: 'You do not have permission to cancel this booking' },
        { status: 403 }
      );
    }
    
    // Delete booking
    const result = await bookingsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Booking cancelled successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}