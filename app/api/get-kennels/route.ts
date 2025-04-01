import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Kennel from "../../../models/Kennels";

export async function GET() {
  try {
    await connectToDatabase();

    const kennels = await Kennel.find({});

    if (!kennels || kennels.length === 0) {
      return NextResponse.json({ message: "No kennel details found" }, { status: 404 });
    }

    return NextResponse.json({ kennels }, { status: 200 });
  } catch (error) {
    console.error("Failed fetching kennels:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
