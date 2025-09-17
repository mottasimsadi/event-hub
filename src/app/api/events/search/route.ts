import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/jwt';

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
    const eventsCollection = db.collection('events');

    // Create a text search query
    const query = {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
        { location: { $regex: searchQuery, $options: 'i' } },
      ],
      // Only show events created by the current user or public events
      $or: [
        { createdBy: user.id },
        { isPublic: true }
      ]
    };

    // Execute the search query
    const events = await eventsCollection.find(query).limit(10).toArray();

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error searching events:', error);
    return NextResponse.json({ error: 'Failed to search events' }, { status: 500 });
  }
}