import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "../../../models/Bookings";
import Owner from "@/models/Owner";
import Dog from "@/models/Dog";

// Create Booking
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const {
      ownerId,
      dogId,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      dayBoarding = false,
      overnightBoarding = false,
      services = [],
      totalAmount = 0,
    } = await req.json();

    if (!ownerId || !dogId || !checkInDate || !checkInTime || !checkOutDate || !checkOutTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return NextResponse.json({ error: "Owner not found!" }, { status: 404 });
    }

    const dog = await Dog.findById(dogId);
    if (!dog) {
      return NextResponse.json({ error: "Dog not found!" }, { status: 404 });
    }

    const newBooking = new Booking({
      ownerId,
      dogId,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      dayBoarding,
      overnightBoarding,
      services,
      totalAmount,
    });

    await newBooking.save();

    return NextResponse.json(
      { message: "Booking created successfully!", booking: newBooking },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Update Booking
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { bookingId, checkInDate, checkInTime, checkOutDate, checkOutTime, status } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Update fields if provided
    if (checkInDate) booking.checkInDate = checkInDate;
    if (checkInTime) booking.checkInTime = checkInTime;
    if (checkOutDate) booking.checkOutDate = checkOutDate;
    if (checkOutTime) booking.checkOutTime = checkOutTime;
    if (status) booking.status = status; // Ensure status is updated only if provided

    await booking.save();

    return NextResponse.json(
      { message: "Booking updated successfully!", booking },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
