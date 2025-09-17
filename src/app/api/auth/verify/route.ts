import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    // Try to get token from multiple sources
    let token;
    
    // First try to get from request body
    try {
      const body = await request.json();
      token = body.token;
    } catch (e) {
      // If parsing JSON fails, continue with other methods
    }
    
    // If no token in body, try Authorization header or cookies
    if (!token) {
      token = getTokenFromRequest(request);
    }
    
    if (!token) {
      return NextResponse.json({ authenticated: false, error: 'No token provided' }, { status: 400 });
    }
    
    const user = verifyToken(token);
    
    if (!user) {
      return NextResponse.json({ authenticated: false, error: 'Invalid token' }, { status: 401 });
    }
    
    return NextResponse.json({ authenticated: true, user }, { status: 200 });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ authenticated: false, error: 'Server error' }, { status: 500 });
  }
}