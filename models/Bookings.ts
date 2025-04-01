import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
  dogId: { type: mongoose.Schema.Types.ObjectId, ref: "Dog", required: true },
  checkInDate: { type: Date, required: true },
  checkInTime: { type: String, required: true },
  checkOutDate: { type: Date, required: true },
  checkOutTime: { type: String, required: true },
  dayBoarding: { type: Boolean, default: false },
  overnightBoarding: { type: Boolean, default: false },

  services: [
    {
      type: String,
      enum: ["boarding", "swimming", "grooming", "training"],
    },
  ],

  totalAmount: { type: Number, default: 0 },

  status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Rejected"], default: "Pending" },

  rejectionReason: {
    type: String,
    required: function functionRequired(this: { status: string }) {
      return this.status === "Rejected";
    },
  },

  boardingStatus: {
    type: String,
    enum: ["CheckedIn", "CheckedOut", "PaymentPending"],
    default: "PaymentPending",
  },

  checkinDetails: {
    guardianName: { type: String },
    kennelName: { type: String },
    subKennelNumber: { type: Number },
    items: {
      leash: { type: Boolean, default: false },
      bed: { type: Boolean, default: false },
      bowl: { type: Boolean, default: false },
      toys: { type: Boolean, default: false },
      medicines: { type: Boolean, default: false },
      instructions: { type: String, default: "" },
    },
  },

}, { timestamps: true });

export const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
