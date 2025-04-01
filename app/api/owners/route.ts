import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import {Owner} from "@/models/Owner";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log("Received Data:", body);

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phoneNumber || !body.address || !body.addressProof) {
      console.error("Missing required fields:", body);
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if email already exists
    const existingOwner = await Owner.findOne({ email: body.email });
    if (existingOwner) {
      return NextResponse.json({ error: "Email already exists!" }, { status: 409 });
    }

    // Create new owner
    const newOwner = new Owner({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      instagramHandle: body.instagramHandle || "",
      profilePicture: body.profilePicture || "",
      address: body.address,
      addressProof: body.addressProof,
      alternateContactName: body.alternateContactName || "",
      alternatePhoneNumber: body.alternatePhoneNumber || "",
      dogs: [], // ✅ Initially empty
      bookings: [], // ✅ Initially empty
    });

    await newOwner.save();

    return NextResponse.json(
      { message: "Owner registered successfully!", owner: newOwner },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering owner:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
