// Database models and types
import { Collection } from 'mongodb';
import { getDatabase } from './db/index';
import { connectToDatabase as connectToDB } from './db/mongodb';

// Re-export the connectToDatabase function
export const connectToDatabase = connectToDB;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  price: number;
  organizer: User | string;
  attendees: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  event: Event | string;
  user: User | string;
  attendees: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

// Generic function to get any collection
export async function getCollection(collectionName: string): Promise<Collection> {
  const db = await getDatabase();
  return db.collection(collectionName);
}

// Function to get events with optional filters
export async function getEvents(filters: { userId?: string } = {}) {
  const eventsCollection = await getCollection('events');
  const query: any = {};
  
  // Apply filters if provided
  if (filters.userId) {
    query.organizer = filters.userId;
  }
  
  const events = await eventsCollection.find(query).toArray();
  return events.map(event => ({
    ...event,
    id: event._id.toString(),
    attendees: event.attendees || []
  }));
}