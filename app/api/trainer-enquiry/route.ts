import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TrainerEnquiry } from "@/models/TrainerEnquiry";

// ✅ POST (You already have)
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { firstName, lastName, email, phone, source, instagram } = body;

    if (!firstName || !lastName || !email || !phone || !source) {
      return NextResponse.json(
        { message: "All fields except Instagram handle are required." },
        { status: 400 }
      );
    }

    const newEnquiry = new TrainerEnquiry({
      firstName,
      lastName,
      email,
      phone,
      source,
      instagram,
    });

    await newEnquiry.save();

    return NextResponse.json(
      { message: "Trainer enquiry submitted successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving trainer enquiry:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const enquiries = await TrainerEnquiry.find().sort({ createdAt: -1 });

    return NextResponse.json({ enquiries }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching trainer enquiries:", error.message);
    return NextResponse.json(
      { message: "Error fetching enquiries", error: error.message },
      { status: 500 }
    );
  }
}
