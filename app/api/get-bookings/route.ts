import { connectToDatabase } from "@/lib/mongodb";
import Bookings from "@/models/Bookings";
import Owner from "@/models/Owner";
import Dog from "@/models/Dog";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Fetch all bookings with fully populated owner and dog details
    const bookings = await Bookings.find({})
      .populate("ownerId", "firstName lastName email phoneNumber address") // Populate owner details
      .populate("dogId", "name breed age sex profilePicture"); // Populate dog details

    if (!bookings.length) {
      return NextResponse.json({ message: "No bookings found!" }, { status: 404 });
    }

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings", details: error.message }, { status: 500 });
  }
}
