import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/jwt";
import { ObjectId } from "mongodb";

// Helper function to validate ObjectId
function isValidObjectId(id: string) {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}

// GET user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Await params before destructuring
    const { id } = await params;

    // Validate ID
    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    // Get users collection
    const usersCollection = await getCollection("users");

    // Find user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Only allow users to access their own data or admins to access any user data
    if (
      user._id.toString() !== currentUser.id &&
      currentUser.role !== "admin"
    ) {
      return NextResponse.json(
        { message: "You do not have permission to view this user" },
        { status: 403 }
      );
    }

    // Return user data (excluding password)
    const { password, ...userData } = user;

    return NextResponse.json(
      {
        user: {
          ...userData,
          id: userData._id.toString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
