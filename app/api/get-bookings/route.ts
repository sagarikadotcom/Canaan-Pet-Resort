import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Booking } from "@/models/Bookings";
import { Owner } from "@/models/Owner";
import { Dog } from "@/models/Dog";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query: any = {};

    if (status) {
      if (status.toLowerCase() === "confirmed") {
        query.status = "confirmed"; // Explicit case
      } else {
        query.status = status.toLowerCase();
      }
    }

    const bookings = await Booking.find(query)
      .populate("ownerId", "firstName lastName email phoneNumber address")
      .populate("dogId", "name breed age sex profilePicture");

    if (!bookings.length) {
      return NextResponse.json(
        { message: "No bookings found!" },
        { status: 404 }
      );
    }

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching bookings:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
