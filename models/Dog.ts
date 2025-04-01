import mongoose from "mongoose";

const DogSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  isSpayed: { type: Boolean, default: false },  // ✅ Default value for missing data
  lastHeatCycle: { type: String, default: "" }, // ✅ Default value for missing data
  breed: { type: String, required: true },
  dob: { type: String, required: true },
  profilePicture: { type: String, default: "" }, // ✅ Default value for missing data
  wasBoardedBefore: { type: Boolean, required: true },
  isVaccinated: { type: Boolean, required: true },
  isKennelCoughVaccinated: { type: Boolean, required: true },
  vaccinationRecords: { type: String, default: "" }, // ✅ Default value for missing data
  foodPreference: { type: String, required: true },
  medicalCondition: { type: String, default: "" }, // ✅ Default value for missing data
  friendlyWithDogs: { type: Boolean, required: true },
  friendlyWithHumans: { type: Boolean, required: true },
}, { timestamps: true, strict: true }); // ✅ Ensures only defined fields are stored

export const Dog = mongoose.models.Dog || mongoose.model("Dog", DogSchema);
