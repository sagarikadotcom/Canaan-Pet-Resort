import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Enquiry } from "@/models/Enquiry";

export async function GET() {
  try {
    await connectToDatabase();

    const enquiries = await Enquiry.find().sort({ createdAt: -1 }); // latest first

    return NextResponse.json({ enquiries }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching enquiries:", error.message);
    return NextResponse.json(
      { message: "Error fetching enquiries", error: error.message },
      { status: 500 }
    );
  }
}
