import mongoose, { Schema, Document } from "mongoose";

export interface EnquiryDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dogName: string;
  dogBreed: string;
  dogDOB: Date;
  dogGender: string;
  dogWeight: number;
  neutered: string;
  dogAgeAtAdoption: string;
  healthConditions?: string;
  foodAllergies?: string;
  temperament?: string;
  vaccinationRecord?: string;
  dewormingRecord?: string;
  reactivity?: any;
  aggression?: any;
  remark?: string;
}

const EnquirySchema = new Schema<EnquiryDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dogName: { type: String, required: true },
    dogBreed: { type: String, required: true },
    dogDOB: { type: Date, required: true },
    dogGender: { type: String, required: true },
    dogWeight: { type: Number, required: true },
    neutered: { type: String, required: true },
    dogAgeAtAdoption: { type: String, required: true },
    healthConditions: { type: String },
    foodAllergies: { type: String },
    temperament: { type: String },
    vaccinationRecord: { type: String },
    dewormingRecord: { type: String },
    reactivity: { type: Schema.Types.Mixed },
    aggression: { type: Schema.Types.Mixed },
    remark: { type: String }, // Add this for your Done Remark
  },
  { timestamps: true }
);

// Safe model registration
export const Enquiry =
  mongoose.models?.Enquiry || mongoose.model<EnquiryDocument>("Enquiry", EnquirySchema);
