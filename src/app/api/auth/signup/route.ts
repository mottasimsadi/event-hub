import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/db/index';
import { hashPassword } from '@/lib/auth/password';
import { createToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get user collection
    const userCollection = await getUsersCollection();

    // Check if user already exists
    const existingUser = await userCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const result = await userCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role for new users
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create JWT token
    const token = createToken({
      id: result.insertedId.toString(),
      email,
      name,
      role: 'user',
    });

    // Create response
    const response = NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: result.insertedId.toString(),
          name,
          email,
          role: 'user',
        },
      },
      { status: 201 }
    );

    // Set cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}