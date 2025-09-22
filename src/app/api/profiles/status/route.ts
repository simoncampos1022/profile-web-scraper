import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/models/Profile";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function PUT(request: NextRequest) {
  try {
    const { profileId, status } = await request.json();

    // Validate input
    if (!profileId || status === undefined) {
      return NextResponse.json(
        { error: "Profile ID and status are required" },
        { status: 400 }
      );
    }

    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let userId: string;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    // Find the profile by userId field
    const profile = await Profile.findOne({ userId: profileId });
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Update the viewers field
    if (!profile.viewers) {
      profile.viewers = new Map();
    }

    if (status === null) {
      // Remove the viewer entry (set to "Yet" status)
      profile.viewers.delete(userId);
    } else {
      // Set the viewer status (true = Good, false = Bad)
      profile.viewers.set(userId, status);
    }

    await profile.save();

    return NextResponse.json(
      { 
        message: "Profile status updated successfully",
        viewers: Object.fromEntries(profile.viewers)
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
