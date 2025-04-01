import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Enquiry } from "@/models/Enquiry";
import multer from "multer";
import { z } from "zod";

// Zod Validation
const enquirySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  dogName: z.string(),
  dogBreed: z.string(),
  dogDOB: z.string(),
  dogGender: z.string(),
  dogWeight: z.coerce.number(),
  neutered: z.string(),
  dogAgeAtAdoption: z.string(),
  healthConditions: z.string(),
  foodAllergies: z.string(),
  temperament: z.string(),
  reactivity: z.string(),
  aggression: z.string().optional(),
  remark: z.string().optional(),
});

// File Upload Setup
const upload = multer({ dest: "./uploads" });

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const files = {
      vaccinationRecord: formData.get("vaccinationRecord"),
      dewormingRecord: formData.get("dewormingRecord"),
    };

    const data: any = {};
    formData.forEach((value, key) => {
      if (key !== "vaccinationRecord" && key !== "dewormingRecord") {
        data[key] = value;
      }
    });

    const validated = enquirySchema.parse(data);

    const newEnquiry = new Enquiry({
      ...validated,
      reactivity: JSON.parse(validated.reactivity),
      aggression: JSON.parse(validated.aggression || "{}"),
      vaccinationRecord: files.vaccinationRecord?.name || "",
      dewormingRecord: files.dewormingRecord?.name || "",
    });

    await newEnquiry.save();

    return NextResponse.json(
      { message: "Enquiry submitted successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });

    return NextResponse.json({ enquiries }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { id, remark } = body;

    if (!id || !remark) {
      return NextResponse.json(
        { message: "id and remark are required" },
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
