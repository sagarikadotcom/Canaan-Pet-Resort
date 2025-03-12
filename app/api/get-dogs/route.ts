import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Dog from "@/models/Dog";
import Owner from "@/models/Owner";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Extract ownerId from query params
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId");

    if (ownerId) {
      // Fetch dogs by ownerId and populate owner details
      const dogs = await Dog.find({ ownerId }).populate("ownerId", "firstName lastName email phoneNumber");

      if (!dogs.length) {
        return NextResponse.json({ error: "No dogs found for this owner!" }, { status: 404 });
      }

      return NextResponse.json(
        {
          owner: {
            _id: dogs[0].ownerId._id,
            firstName: dogs[0].ownerId.firstName,
            lastName: dogs[0].ownerId.lastName,
            email: dogs[0].ownerId.email,
            phoneNumber: dogs[0].ownerId.phoneNumber,
          },
          dogs: dogs.map(dog => ({
            _id: dog._id,
            name: dog.name,
            breed: dog.breed,
            age: dog.age,
            sex: dog.sex,
            isSpayed: dog.isSpayed,
            lastHeatCycle: dog.lastHeatCycle,
            dob: dog.dob,
            profilePicture: dog.profilePicture,
            wasBoardedBefore: dog.wasBoardedBefore,
            isVaccinated: dog.isVaccinated,
            isKennelCoughVaccinated: dog.isKennelCoughVaccinated,
            vaccinationRecords: dog.vaccinationRecords,
            foodPreference: dog.foodPreference,
            medicalCondition: dog.medicalCondition,
            friendlyWithDogs: dog.friendlyWithDogs,
            friendlyWithHumans: dog.friendlyWithHumans,
          })),
        },
        { status: 200 }
      );
    } else {
      // Fetch all dogs and populate owner details
      const allDogs = await Dog.find().populate("ownerId", "firstName lastName email phoneNumber");

      const dogsWithOwners = allDogs.map(dog => ({
        _id: dog._id,
        name: dog.name,
        breed: dog.breed,
        age: dog.age,
        sex: dog.sex,
        isSpayed: dog.isSpayed,
        lastHeatCycle: dog.lastHeatCycle,
        dob: dog.dob,
        profilePicture: dog.profilePicture,
        wasBoardedBefore: dog.wasBoardedBefore,
        isVaccinated: dog.isVaccinated,
        isKennelCoughVaccinated: dog.isKennelCoughVaccinated,
        vaccinationRecords: dog.vaccinationRecords,
        foodPreference: dog.foodPreference,
        medicalCondition: dog.medicalCondition,
        friendlyWithDogs: dog.friendlyWithDogs,
        friendlyWithHumans: dog.friendlyWithHumans,
        owner: {
          _id: dog.ownerId._id,
          firstName: dog.ownerId.firstName,
          lastName: dog.ownerId.lastName,
          email: dog.ownerId.email,
          phoneNumber: dog.ownerId.phoneNumber,
        },
      }));

      return NextResponse.json({ dogs: dogsWithOwners }, { status: 200 });
    }
  } catch (error: any) {
    console.error("Error fetching dogs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
