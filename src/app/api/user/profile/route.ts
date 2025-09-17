import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { getCurrentUser, createToken } from '@/lib/auth/jwt';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

// GET user profile
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get users collection
    const usersCollection = await getCollection('users');
    
    // Find user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(currentUser.id) });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user data (excluding password)
    const { password, ...userData } = user;
    
    return NextResponse.json({
      user: {
        ...userData,
        id: userData._id.toString()
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get request body
    const { name, email, currentPassword, newPassword } = await request.json();
    
    // Get users collection
    const usersCollection = await getCollection('users');
    
    // Find user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(currentUser.id) });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await usersCollection.findOne({ email, _id: { $ne: new ObjectId(currentUser.id) } });
      if (existingUser) {
        return NextResponse.json(
          { message: 'Email is already in use' },
          { status: 400 }
        );
      }
    }
    
    // Prepare update data
    const updateData: any = {};
    
    // Update basic info
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 400 }
        );
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }
    
    // Update user in database
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(currentUser.id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get updated user
    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(currentUser.id) });
    
    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Failed to retrieve updated user' },
        { status: 500 }
      );
    }
    
    // Return updated user data (excluding password)
    const { password, ...userData } = updatedUser as any;
    
    // Create a new token with the updated user data
    const newToken = createToken({
      id: userData._id.toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role
    });
    
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        ...userData,
        id: userData._id.toString()
      },
      token: newToken
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}