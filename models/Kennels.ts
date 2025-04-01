import mongoose from "mongoose";

const SubKennelSchema = new mongoose.Schema({
  subKennelNumber: { type: Number, required: true },
  occupied: { type: Boolean, default: false },
});

const KennelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  guardianName: { type: String, required: true },
  subKennels: [SubKennelSchema],
}, { timestamps: true });

export default mongoose.models.Kennel || mongoose.model("Kennel", KennelSchema);
