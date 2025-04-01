import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Enquiry } from "@/models/Enquiry";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();

    const { id } = params;
    const body = await req.json();
    const { remark } = body;

    if (!remark) {
      return NextResponse.json(
        { message: "Remark is required" },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { remark },
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json(
        { message: "Enquiry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Remark updated successfully", enquiry },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating remark", error: error.message },
      { status: 500 }
    );
  }
}
