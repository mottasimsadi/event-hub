import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Define types for JWT payload
export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role?: string;
}

// JWT token options
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

// Create a JWT token
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify a JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log('Token verified successfully:', decoded);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Set JWT token in HTTP-only cookie
export async function setTokenCookie(token: string): Promise<void> {
  (await cookies()).set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

// Get JWT token from cookies
export async function getTokenFromCookies(): Promise<string | undefined> {
  return (await cookies()).get('token')?.value;
}

// Get JWT token from request
export function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get token from cookies
  const token = request.cookies.get('token')?.value;
  if (token) return token;

  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

// Remove JWT token cookie
export async function removeTokenCookie(): Promise<void> {
  (await cookies()).delete('token');
}

// Get current user from token
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getTokenFromCookies();
  console.log('Token from cookies:', token ? 'Token exists' : 'No token found');
  
  if (!token) return null;
  
  const user = verifyToken(token);
  console.log('User from token:', user);
  return user;
}