import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Dog } from "@/models/Dog";
import { Owner } from "@/models/Owner";
import { Booking } from "@/models/Bookings";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId");
    const dogId = searchParams.get("dogId");
    const bookingId = searchParams.get("bookingId");
    let dogs;

    // -----------------------
    // Get dogs by Owner ID
    // -----------------------
    if (ownerId) {
      dogs = await Dog.find({ ownerId }).populate(
        "ownerId",
        "firstName lastName email phoneNumber"
      );

      if (!dogs.length) {
        return NextResponse.json(
          { error: "No dogs found for this owner!" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          owner: dogs[0].ownerId
            ? {
                _id: dogs[0].ownerId._id,
                firstName: dogs[0].ownerId.firstName,
                lastName: dogs[0].ownerId.lastName,
                email: dogs[0].ownerId.email,
                phoneNumber: dogs[0].ownerId.phoneNumber,
              }
            : null,
          dogs: dogs.map((dog) => ({
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
    }

    // -----------------------
    // Get single dog by Dog ID
    // -----------------------
    else if (dogId) {
      const dog = await Dog.findById(dogId).populate(
        "ownerId",
        "firstName lastName email phoneNumber"
      );

      if (!dog) {
        return NextResponse.json({ error: "Dog not found!" }, { status: 404 });
      }

      return NextResponse.json(
        {
          dog: {
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
          },
          owner: dog.ownerId
            ? {
                _id: dog.ownerId._id,
                firstName: dog.ownerId.firstName,
                lastName: dog.ownerId.lastName,
                email: dog.ownerId.email,
                phoneNumber: dog.ownerId.phoneNumber,
              }
            : null,
        },
        { status: 200 }
      );
    }

    // -----------------------
    // Get dog by Booking ID
    // -----------------------
    else if (bookingId) {
      const booking = await Booking.findById(bookingId)
        .populate("dogId")
        .populate("ownerId");

      if (!booking) {
        return NextResponse.json(
          { error: "Booking not found!" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          dog: booking.dogId,
          owner: booking.ownerId,
        },
        { status: 200 }
      );
    }

    // -----------------------
    // Get all dogs
    // -----------------------
    else {
      const allDogs = await Dog.find().populate(
        "ownerId",
        "firstName lastName email phoneNumber"
      );

      if (!allDogs || allDogs.length === 0) {
        return NextResponse.json({ error: "No dogs found!" }, { status: 404 });
      }

      const dogsWithOwners = allDogs
        .filter((dog) => dog.ownerId !== null)
        .map((dog) => ({
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
    console.error("Error fetching dogs:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
