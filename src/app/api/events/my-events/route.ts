import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/jwt';

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
    
    // Get events collection
    const eventsCollection = await getCollection('events');
    
    // Find events created by the current user
    const events = await eventsCollection
      .find({ createdBy: user.id })
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}