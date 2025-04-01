"use strict";

import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";

// Load environment variables
dotenv.config();

// ✅ MongoDB Connection URI from .env
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in .env file");
  process.exit(1);
}

// ✅ Define `Owner` Schema
const OwnerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  address: String,
  dogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dog" }],
});

// ✅ Define `Dog` Schema
const DogSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
  name: String,
  age: Number,
  sex: String,
  breed: String,
  dob: String,
  isVaccinated: Boolean,
  foodPreference: String,
  friendlyWithDogs: Boolean,
  friendlyWithHumans: Boolean,
});

// ✅ Define `Booking` Schema
const BookingSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
  dogId: { type: mongoose.Schema.Types.ObjectId, ref: "Dog", required: true },
  checkInDate: Date,
  checkInTime: String,
  checkOutDate: Date,
  checkOutTime: String,
  services: [{ type: String, enum: ["boarding", "swimming", "grooming", "board and train"] }],
  status: { type: String, enum: ["Pending", "Confirmed", "Rejected"], default: "Pending" },
});

// ✅ Create Models
const Owner = mongoose.model("Owner", OwnerSchema);
const Dog = mongoose.model("Dog", DogSchema);
const Booking = mongoose.model("Booking", BookingSchema);

// ✅ Connect to MongoDB and Seed Data
async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "kennel-management", // ✅ Uses the correct database
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB (kennel-management)");

    // 🚀 Clear existing data
    await Owner.deleteMany({});
    await Dog.deleteMany({});
    await Booking.deleteMany({});
    console.log("🔄 Existing data cleared.");

    const owners = [];
    const dogs = [];
    const bookings = [];

    // ✅ Create 10 Owners
    for (let i = 0; i < 10; i++) {
      const owner = new Owner({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress(),
      });

      owners.push(owner);
    }
    await Owner.insertMany(owners);
    console.log("✅ 10 Owners Created");

    // ✅ Create 10 Dogs (Each assigned to a random owner)
    for (let i = 0; i < 10; i++) {
      const owner = owners[Math.floor(Math.random() * owners.length)]; // Random owner
      const dog = new Dog({
        ownerId: owner._id,
        name: faker.person.firstName(),
        age: faker.number.int({ min: 1, max: 15 }),
        sex: faker.helpers.arrayElement(["Male", "Female"]),
        breed: faker.animal.dog(),
        dob: faker.date.birthdate(),
        isVaccinated: faker.datatype.boolean(),
        foodPreference: faker.helpers.arrayElement(["Veg", "Non-Veg", "Mixed"]),
        friendlyWithDogs: faker.datatype.boolean(),
        friendlyWithHumans: faker.datatype.boolean(),
      });

      dogs.push(dog);
      owner.dogs.push(dog._id); // Link dog to owner
    }
    await Dog.insertMany(dogs);
    await Promise.all(owners.map((owner) => owner.save()));
    console.log("✅ 10 Dogs Created & Linked to Owners");

    // ✅ Create 50 Initial Bookings (Confirmed)
    for (let i = 0; i < 50; i++) {
      const owner = owners[Math.floor(Math.random() * owners.length)];
      const dog = dogs[Math.floor(Math.random() * dogs.length)];

      const checkInDate = faker.date.between({ from: "2025-04-01", to: "2025-04-30" });
      const checkOutDate = faker.date.soon({ days: faker.number.int({ min: 1, max: 10 }), refDate: checkInDate });

      const booking = new Booking({
        ownerId: owner._id,
        dogId: dog._id,
        checkInDate,
        checkInTime: "10:00 AM",
        checkOutDate,
        checkOutTime: "10:00 AM",
        services: ["boarding"],
        status: "Confirmed",
      });

      bookings.push(booking);
    }

    // ✅ Create 10 Bookings for **Today's Check-In & Checkout**
    for (let i = 0; i < 10; i++) {
      const owner = owners[Math.floor(Math.random() * owners.length)];
      const dog = dogs[Math.floor(Math.random() * dogs.length)];

      const today = dayjs().toDate();

      const booking = new Booking({
        ownerId: owner._id,
        dogId: dog._id,
        checkInDate: today,
        checkInTime: "09:00 AM",
        checkOutDate: today,
        checkOutTime: "06:00 PM",
        services: ["boarding", "grooming"],
        status: faker.helpers.arrayElement(["Confirmed", "Pending"]),
      });

      bookings.push(booking);
    }

    // ✅ Create 10 Bookings for **Tomorrow's Check-In & Checkout**
    for (let i = 0; i < 10; i++) {
      const owner = owners[Math.floor(Math.random() * owners.length)];
      const dog = dogs[Math.floor(Math.random() * dogs.length)];

      const tomorrow = dayjs().add(1, "day").toDate();

      const booking = new Booking({
        ownerId: owner._id,
        dogId: dog._id,
        checkInDate: tomorrow,
        checkInTime: "11:00 AM",
        checkOutDate: tomorrow,
        checkOutTime: "05:00 PM",
        services: ["swimming"],
        status: faker.helpers.arrayElement(["Confirmed", "Pending"]),
      });

      bookings.push(booking);
    }

    // ✅ Create 25 Additional Bookings (Pending, Confirmed, Rejected)
    for (let i = 0; i < 25; i++) {
      const owner = owners[Math.floor(Math.random() * owners.length)];
      const dog = dogs[Math.floor(Math.random() * dogs.length)];

      const checkInDate = faker.date.between({ from: "2023-01-01", to: "2024-12-01" });
      const checkOutDate = faker.date.soon({ days: faker.number.int({ min: 1, max: 10 }), refDate: checkInDate });

      const booking = new Booking({
        ownerId: owner._id,
        dogId: dog._id,
        checkInDate,
        checkInTime: "10:00 AM",
        checkOutDate,
        checkOutTime: "10:00 AM",
        services: ["boarding"],
        status:  "Confirmed",
      });

      bookings.push(booking);
    }

    await Booking.insertMany(bookings);
    console.log("✅ 95 Total Bookings Created (Including Today & Tomorrow Check-Ins/Outs)");

    console.log("🎉 Database Seeding Complete!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    mongoose.connection.close();
  }
}

// ✅ Run the Seed Function
seedDatabase();
