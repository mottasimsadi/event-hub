import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/jwt";

// Helper function to validate ObjectId
function isValidObjectId(id: string) {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}

// GET single event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Validate ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }

    // Get events collection
    const eventsCollection = await getCollection("events");
    const usersCollection = await getCollection("users");

    // Find event
    const event = await eventsCollection.findOne({ _id: new ObjectId(id) });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Get organizer name if createdBy exists
    if (event.createdBy && isValidObjectId(event.createdBy)) {
      const organizer = await usersCollection.findOne({
        _id: new ObjectId(event.createdBy),
      });
      if (organizer) {
        event.organizer = organizer.name;
      }
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Validate ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }

    // Get request body
    const eventData = await request.json();

    // Get events collection
    const eventsCollection = await getCollection("events");

    // Find event to check ownership
    const existingEvent = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Check if user is the creator or an admin
    if (existingEvent.createdBy !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { message: "You do not have permission to update this event" },
        { status: 403 }
      );
    }

    // Ensure organizer name is preserved
    if (!eventData.organizer) {
      eventData.organizer = existingEvent.organizer;
    }

    // Format data
    const updatedEvent = {
      ...eventData,
      updatedAt: new Date(),
      // Convert string values to appropriate types
      date: eventData.date ? new Date(eventData.date) : existingEvent.date,
      capacity: eventData.capacity
        ? parseInt(eventData.capacity)
        : existingEvent.capacity,
      price: eventData.price
        ? parseFloat(eventData.price)
        : existingEvent.price,
    };

    // Update event
    const result = await eventsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEvent }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Validate ID
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }

    // Get events collection
    const eventsCollection = await getCollection("events");

    // Find event to check ownership
    const existingEvent = await eventsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Check if user is the creator or an admin
    if (existingEvent.createdBy !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { message: "You do not have permission to delete this event" },
        { status: 403 }
      );
    }

    // Delete event
    const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
