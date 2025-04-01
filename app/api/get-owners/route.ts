import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import {Owner} from "@/models/Owner";
import {Dog} from "@/models/Dog";
import {Booking} from "@/models/Bookings";
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const phoneNumber = searchParams.get("phoneNumber");
    const ownerId = searchParams.get("ownerId");
    const email = searchParams.get("email");
    let owners;

    if (phoneNumber) {
      // Fetch owner by phone number
      owners = await Owner.findOne({ phoneNumber }).populate("dogs");
      if (!owners) {
        return NextResponse.json({ error: "Owner not found!" }, { status: 404 });
      }
      
      // Fetch dog's details for Redux
      const dogDetails = await Dog.find({ ownerId: owners._id });

      return NextResponse.json({ owners, dogs: dogDetails }, { status: 200 });
    } else if (ownerId) {
      // Fetch owner by ownerId
      owners = await Owner.findById(ownerId).populate("dogs");
      if (!owners) {
        return NextResponse.json({ error: "Owner not found!" }, { status: 404 });
      }
      // Fetch dog's details for Redux
      const dogDetails = await Dog.find({ ownerId: owners._id });

      return NextResponse.json({ owners, dogs: dogDetails }, { status: 200 });
    } else if (email) {
      // ✅ Fetch owner by email
      owners = await Owner.findOne({ email }).populate("dogs");
      const dogDetails = await Dog.find({ ownerId: owners._id });

      return NextResponse.json({ owners, dogs: dogDetails }, { status: 200 });
   
    } else if (searchParams.get("bookingId")) {
      const bookingId = searchParams.get("bookingId");
      const booking = await Booking.findById(bookingId).populate("ownerId").populate("dogId");

      if (!booking) return NextResponse.json({ error: "Booking not found!" }, { status: 404 });

      return NextResponse.json({ owner: booking.ownerId, dog: booking.dogId }, { status: 200 });
    }
    
    else {
      // Fetch all owners if no query parameters are provided
      owners = await Owner.find().populate("dogs");
      if (!owners || owners.length === 0) {
        return NextResponse.json({ error: "No owners found!" }, { status: 404 });
      }

      // Fetch all dog details separately
      const allDogs = await Dog.find();
 return NextResponse.json({ owners, dogs: allDogs }, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error fetching owners and dogs:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
