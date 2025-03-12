import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Owner from "@/models/Owner";
import Dog from "@/models/Dog";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    console.log("Received Dog Data:", body);

    const {
      ownerId,
      name,
      age,
      sex,
      isSpayed = false,
      lastHeatCycle = "",
      breed,
      dob,
      profilePicture = "",
      wasBoardedBefore,
      isVaccinated,
      isKennelCoughVaccinated,
      vaccinationRecords = "",
      foodPreference,
      medicalCondition = "",
      friendlyWithDogs,
      friendlyWithHumans,
    } = body;

    // Validate required fields
    if (!ownerId || !name || !age || !sex || !breed || !dob || wasBoardedBefore === undefined || isVaccinated === undefined || isKennelCoughVaccinated === undefined || !foodPreference || friendlyWithDogs === undefined || friendlyWithHumans === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if owner exists
    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return NextResponse.json({ error: "Owner not found!" }, { status: 404 });
    }

    // Create new dog entry in `dogs` collection
    const newDog = new Dog({
      ownerId,
      name,
      age,
      sex,
      isSpayed,
      lastHeatCycle,
      breed,
      dob,
      profilePicture,
      wasBoardedBefore,
      isVaccinated,
      isKennelCoughVaccinated,
      vaccinationRecords,
      foodPreference,
      medicalCondition,
      friendlyWithDogs,
      friendlyWithHumans,
    });

    await newDog.save(); // ✅ Saves the dog to the `dogs` collection

    // Update Owner's `dogs` array with the newly created dog's ID
    await Owner.findByIdAndUpdate(ownerId, {
      $push: { dogs: newDog._id } // ✅ Push the new dog's ID into the owner's `dogs` array
    }, { new: true });

    // Fetch the full saved dog document
    const savedDog = await Dog.findById(newDog._id);

    console.log("Saved Dog Data:", savedDog); // ✅ Check if all fields are stored

    return NextResponse.json(
      { message: "Dog added successfully!", dog: savedDog },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding dog:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
