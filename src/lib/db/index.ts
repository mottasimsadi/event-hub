import { Collection, Db } from 'mongodb';
import clientPromise from './mongodb';

// Define types for our collections
export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  _id?: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  price: number;
  capacity: number;
  image?: string;
  organizer: string; // User ID
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  _id?: string;
  eventId: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Cache the MongoDB connection
let cachedDb: Db | null = null;

// Function to get the database connection
export async function getDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB_NAME || 'event-hub');
  cachedDb = db;
  return db;
}

// Helper functions to get collections
export async function getUsersCollection(): Promise<Collection<User>> {
  const db = await getDatabase();
  return db.collection<User>('users');
}

export async function getEventsCollection(): Promise<Collection<Event>> {
  const db = await getDatabase();
  return db.collection<Event>('events');
}

export async function getBookingsCollection(): Promise<Collection<Booking>> {
  const db = await getDatabase();
  return db.collection<Booking>('bookings');
}
