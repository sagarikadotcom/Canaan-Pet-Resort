import mongoose from "mongoose";

const OwnerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    instagramHandle: { type: String },
    profilePicture: { type: String },
    address: { type: String, required: true },
    addressProof: { type: String, required: true },
    alternateContactName: { type: String },
    alternatePhoneNumber: { type: String },
    dogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dog" }],
  },
  { timestamps: true }
);

// ✅ Use a Global Mongoose Cache to Prevent Multiple Model Declarations
export const Owner = mongoose.models.Owner || mongoose.model("Owner", OwnerSchema);

