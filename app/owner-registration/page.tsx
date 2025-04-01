"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Card, CardContent, Typography, Box, Stepper, Step, StepLabel } from "@mui/material";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { setOwners } from "@/redux/slices/ownerSlice";
import { useDispatch } from "react-redux";

interface OwnerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  instagramHandle?: string;
  address: string;
  alternateContactName?: string;
  alternatePhoneNumber?: string;
  profilePicture?: string;
  addressProof?: string;
}

export default function OwnerRegistration() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const { handleSubmit, control } = useForm<OwnerFormData>();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [addressProof, setAddressProof] = useState<File | null>(null);
const dispatch =useDispatch()
  const steps = ["Personal Details", "Contact Info", "Upload Documents", "Confirmation"];

  const onSubmit = async (data: OwnerFormData) => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // Upload Profile Picture
      const profilePicUrl = profilePicture ? await uploadFile(profilePicture) : "";
      const addressProofUrl = addressProof ? await uploadFile(addressProof) : "";

      const formData = { ...data, profilePicture: profilePicUrl, addressProof: addressProofUrl };

      try {
        const response = await fetch("/api/owners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to register owner");
        }
dispatch(setOwners(response.data))
        router.push("/dashboard");
      } catch (error) {
        console.error("Error registering owner:", error);
      }
    }
  };

  async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
  
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
    return data.fileUrl; // This will be the image URL
  }
  
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
      <Typography variant="h4">Owner Registration</Typography>
      <Stepper activeStep={activeStep} sx={{ width: "80%", mt: 3, mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Card sx={{ width: "400px", p: 3 }}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {activeStep === 0 && (
                <>
                  <Controller name="firstName" control={control} render={({ field }) => <TextField {...field} label="First Name" fullWidth sx={{ mb: 2 }} />} />
                  <Controller name="lastName" control={control} render={({ field }) => <TextField {...field} label="Last Name" fullWidth sx={{ mb: 2 }} />} />
                  <Controller name="email" control={control} render={({ field }) => <TextField {...field} label="Email" type="email" fullWidth sx={{ mb: 2 }} />} />
                </>
              )}

              {activeStep === 1 && (
                <>
                  <Controller name="phoneNumber" control={control} render={({ field }) => <TextField {...field} label="Phone Number" type="tel" fullWidth sx={{ mb: 2 }} />} />
                  <Controller name="instagramHandle" control={control} render={({ field }) => <TextField {...field} label="Instagram Handle" fullWidth sx={{ mb: 2 }} />} />
                  <Controller name="address" control={control} render={({ field }) => <TextField {...field} label="Address" fullWidth sx={{ mb: 2 }} />} />
                  <Controller name="alternateContactName" control={control} render={({ field }) => <TextField {...field} label="Alternate Contact Name" fullWidth sx={{ mb: 2 }} />} />
                  <Controller name="alternatePhoneNumber" control={control} render={({ field }) => <TextField {...field} label="Alternate Phone Number" fullWidth sx={{ mb: 2 }} />} />
                </>
              )}

              {activeStep === 2 && (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>Upload Profile Picture</Typography>
                  <input type="file" onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} accept="image/*" />
                  
                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Upload Address Proof</Typography>
                  <input type="file" onChange={(e) => setAddressProof(e.target.files?.[0] || null)} accept="image/*, application/pdf" />
                </>
              )}

              {activeStep === 3 && (
                <Typography variant="h6" align="center">Registration Successful! Redirecting...</Typography>
              )}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                {activeStep > 0 && <Button variant="contained" onClick={() => setActiveStep(activeStep - 1)}>Back</Button>}
                <Button variant="contained" color="primary" type="submit">{activeStep === 3 ? "Finish" : "Next"}</Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
