import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/jwt';
import { ObjectId } from 'mongodb';

// Helper function to validate ObjectId
function isValidObjectId(id: string) {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}

// GET all events
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const currentUser = await getCurrentUser();
    
    // Get events collection
    const eventsCollection = await getCollection('events');
    const usersCollection = await getCollection('users');
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    
    // Build query
    const query: any = {};
    if (category) {
      query.category = category;
    }
    
    // For admin dashboard, don't apply limit and include all events
    // For public routes, apply limit and only show active events
    let events;
    if (currentUser?.role === 'admin' && request.headers.get('referer')?.includes('/dashboard')) {
      events = await eventsCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
    } else {
      events = await eventsCollection
        .find(query)
        .sort({ date: 1 }) // Sort by date ascending (upcoming first)
        .limit(limit)
        .toArray();
    }
    
    // Add organizer names to events
    for (const event of events) {
      // Check both userId and createdBy fields
      const creatorId = event.userId || event.createdBy;
      if (creatorId) {
        const organizer = await usersCollection.findOne({
          $or: [
            { id: creatorId },
            { _id: isValidObjectId(creatorId) ? new ObjectId(creatorId) : null }
          ].filter(Boolean)
        });
        
        if (organizer) {
          event.organizer = organizer.name;
          
          // For admin dashboard, include more creator details
          if (currentUser?.role === 'admin' && request.headers.get('referer')?.includes('/dashboard')) {
            event.createdBy = {
              name: organizer.name,
              email: organizer.email
            };
          }
        }
      }
    }
    
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new event
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
    const eventData = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'time', 'location'];
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Format data
    const newEvent = {
      ...eventData,
      createdBy: user.id,
      organizer: user.name, // Store organizer name directly
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      // Convert string values to appropriate types
      date: new Date(eventData.date),
      capacity: eventData.capacity ? parseInt(eventData.capacity) : null,
      price: eventData.price ? parseFloat(eventData.price) : 0,
      // Set default image if none provided
      image: eventData.image || `https://picsum.photos/seed/event-${Date.now()}/800/400`
    };
    
    // Get events collection
    const eventsCollection = await getCollection('events');
    
    // Insert event
    const result = await eventsCollection.insertOne(newEvent);
    
    return NextResponse.json(
      { 
        message: 'Event created successfully',
        eventId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}