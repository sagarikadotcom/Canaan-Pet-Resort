import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Booking } from "@/models/Bookings";

export async function PATCH(req: NextRequest, { params }: { params: { bookingId: string } }) {
  try {
    await connectToDatabase();
    const { bookingId } = params;
    const { checkinDetails, bookingStatus } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (checkinDetails) {
      booking.checkinDetails = {
        guardianName: checkinDetails.guardian,
        kennelName: checkinDetails.kennel,
        subKennelNumber: checkinDetails.subKennel,
        items: {
          leash: checkinDetails.items.leash || false,
          bed: checkinDetails.items.bed || false,
          bowl: checkinDetails.items.bowl || false,
          toys: checkinDetails.items.toys || false,
          medicines: checkinDetails.items.medicines || false,
          instructions: checkinDetails.items.instructions || "",
        },
      };
    }

    if (bookingStatus) {
      booking.boardingStatus = bookingStatus;
    }

    await booking.save();

    return NextResponse.json({ message: "Check-In updated successfully", booking }, { status: 200 });
  } catch (error) {
    console.error("Error updating check-in:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
