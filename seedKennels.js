import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Kennel Schema
const KennelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  guardianName: { type: String, required: true },
  guardianId: { type: String, required: true },
  subKennels: [
    {
      number: Number,
      occupied: { type: Boolean, default: false },
    },
  ],
}, { timestamps: true });

// Kennel Model
const Kennel = mongoose.models.Kennel || mongoose.model('Kennel', KennelSchema);

// Seed Data
const kennelsData = [
  { name: "Kennel A", guardianName: "John Doe", guardianId: "G101" },
  { name: "Kennel B", guardianName: "Jane Smith", guardianId: "G102" },
  { name: "Kennel C", guardianName: "Robert Brown", guardianId: "G103" },
  { name: "Kennel D", guardianName: "Emily Davis", guardianId: "G103" },
  { name: "Kennel E", guardianName: "Michael White", guardianId: "G105" },
  { name: "Kennel D", guardianName: "Sophia Lee", guardianId: "G104" },
  { name: "Kennel E", guardianName: "William Johnson", guardianId: "G105" },
];

// Generate subkennels
const generateSubKennels = () => {
  return Array.from({ length: 10 }, (_, index) => ({
    number: index + 1,
    isOccupied: false,
  }));
};

async function seedKennels() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not defined in .env');

    await mongoose.connect(uri, {
      dbName: 'kennel-management',
    });

    console.log("db connected sucessfully")
    // Clear existing kennels
    await mongoose.connection.collection("kennels").deleteMany({});

    // Insert kennels with subkennels
    const kennelsWithSubkennels = kennelsData.map(kennel => ({
      ...kennel,
      subKennels: generateSubKennels()
    }));

    await mongoose.connection.collection("kennels").insertMany(kennelsWithSubkennels);

    console.log("✅ Kennels seeded successfully!");
    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error seeding kennels:", error);
    mongoose.connection.close();
  }
};

generateSubKennels();
seedKennels()
