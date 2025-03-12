import mongoose from "mongoose";

// Define Schema
const BookingSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true }, // ✅ Reference to Owner
  dogId: { type: mongoose.Schema.Types.ObjectId, ref: "Dog", required: true }, // ✅ Reference to Dog
  checkInDate: { type: Date, required: true }, // ✅ Ensures proper date format
  checkInTime: { type: String, required: true },
  checkOutDate: { type: Date, required: true },
  checkOutTime: { type: String, required: true },
  dayBoarding: { type: Boolean, default: false }, // ✅ Is it a day boarding?
  overnightBoarding: { type: Boolean, default: false }, // ✅ Is it overnight?

  // Services Array (Can be expanded later)
  services: [
    {
      type: String,
      enum: ["boarding", "swimming", "grooming", "board and train"], // ✅ Predefined list of services
    },
  ],

  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    default: "Pending", // ✅ Allows status tracking
  },

  totalAmount: { type: Number, default: 0 }, // ✅ Can be used for billing

}, { timestamps: true }); // ✅ Auto adds `createdAt` and `updatedAt`

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
