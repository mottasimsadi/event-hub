import { NextRequest, NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/db/index';
import { comparePassword } from '@/lib/auth/password';
import { createToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get user collection
    const userCollection = await getUsersCollection();

    // Find user by email
    const user = await userCollection.findOne({ email });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = createToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || 'user', // Ensure role is included with default 'user'
    });

    // Create response
    const response = NextResponse.json(
      {
        message: 'Login successful',
        token: token, // Include token in the response body for client-side storage
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || 'user',
        },
      },
      { status: 200 }
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
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}