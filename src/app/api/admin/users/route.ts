import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/jwt';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all users except the current admin
    const usersCollection = await getCollection('users');
    const users = await usersCollection
      .find({ id: { $ne: currentUser.id } })
      .toArray();

    // Get events and bookings collections
    const eventsCollection = await getCollection('events');
    const bookingsCollection = await getCollection('bookings');

    // Calculate events and bookings count for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        // Count events created by this user
        const eventsCount = await eventsCollection.countDocuments({
          $or: [
            { createdBy: user.id },
            { createdBy: user._id?.toString() }
          ]
        });

        // Count bookings made by this user
        const bookingsCount = await bookingsCollection.countDocuments({
          $or: [
            { userId: user.id },
            { userId: user._id?.toString() }
          ]
        });

        return {
          ...user,
          eventsCount,
          bookingsCount,
        };
      })
    );

    return NextResponse.json({ users: usersWithCounts });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}