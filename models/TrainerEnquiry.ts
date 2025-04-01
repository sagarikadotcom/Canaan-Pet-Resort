import mongoose, { Schema, Document } from "mongoose";

export interface TrainerEnquiryDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  instagram: string;
}

const TrainerEnquirySchema = new Schema<TrainerEnquiryDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    source: { type: String, required: true },
    instagram: { type: String },
  },
  { timestamps: true }
);

export const TrainerEnquiry =
  mongoose.models?.TrainerEnquiry ||
  mongoose.model<TrainerEnquiryDocument>("TrainerEnquiry", TrainerEnquirySchema);
