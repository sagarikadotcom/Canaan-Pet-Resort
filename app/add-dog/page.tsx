"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { 
  TextField, Button, Card, CardContent, Typography, Box, Select, MenuItem, 
  FormControl, InputLabel, RadioGroup, FormControlLabel, Radio
} from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addDog } from "@/redux/slices/dogSlice";

export default function AddDog() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { handleSubmit, control, watch } = useForm();
  const [vaccinationRecords, setVaccinationRecords] = useState<File | null>(null);
  const ownerId = useSelector((state: RootState) => state.owner).owner?.ownerId;
  const sex = watch("sex");
  const isSpayed = watch("isSpayed");

  const onSubmit = async (data: any) => {
    const vaccinationUrl = vaccinationRecords ? await uploadFile(vaccinationRecords) : "";

    const formData = { 
      ...data, 
      vaccinationRecords: vaccinationUrl,
      ownerId, 
      isSpayed: data.isSpayed === "Yes",
      wasBoardedBefore: data.wasBoardedBefore === "Yes",
      isVaccinated: data.isVaccinated === "Yes",
      isKennelCoughVaccinated: data.isKennelCoughVaccinated === "Yes",
      friendlyWithDogs: data.friendlyWithDogs === "Yes",
      friendlyWithHumans: data.friendlyWithHumans === "Yes",
    };
console.log("formData",formData)
    try {
      const response = await fetch("/api/dogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add dog");
      }

      const responseData = await response.json();
      dispatch(addDog(responseData.dog)); // ✅ Store the new dog in Redux
      router.push("/dashboard");
    } catch (error) {
      console.error("Error adding dog:", error);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const data = await response.json();
    return data.fileUrl;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>🐶 Add a Dog</Typography>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Card sx={{ width: "400px", p: 3, boxShadow: "0px 4px 10px rgba(0,0,0,0.2)", borderRadius: 3 }}>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller name="name" control={control} render={({ field }) => (
                <TextField {...field} label="Dog's Name" fullWidth sx={{ mb: 2 }} required />
              )} />
              <Controller name="breed" control={control} render={({ field }) => (
                <TextField {...field} label="Breed" fullWidth sx={{ mb: 2 }} required />
              )} />
              <Controller name="dob" control={control} render={({ field }) => (
                <TextField {...field} label="Date of Birth" type="date" fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} required />
              )} />
              <Controller name="age" control={control} render={({ field }) => (
                <TextField {...field} label="Age (Years)" type="number" fullWidth sx={{ mb: 2 }} required />
              )} />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Sex</InputLabel>
                <Controller name="sex" control={control} render={({ field }) => (
                  <Select {...field} required>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                )} />
              </FormControl>

              {sex === "Female" && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Typography variant="body1">Is the dog spayed?</Typography>
                  <Controller name="isSpayed" control={control} render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                  )} />
                </FormControl>
              )}

              {sex === "Female" && isSpayed === "No" && (
                <Controller name="lastHeatCycle" control={control} render={({ field }) => (
                  <TextField {...field} label="Last Heat Cycle Date" type="date" fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
                )} />
              )}

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Food Preference</InputLabel>
                <Controller name="foodPreference" control={control} render={({ field }) => (
                  <Select {...field} required>
                    <MenuItem value="Veg">Veg</MenuItem>
                    <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                    <MenuItem value="Dry Kibbles">Dry Kibbles</MenuItem>
                  </Select>
                )} />
              </FormControl>

              {["wasBoardedBefore", "isVaccinated", "isKennelCoughVaccinated", "friendlyWithDogs", "friendlyWithHumans"].map(fieldName => (
                <FormControl fullWidth sx={{ mb: 2 }} key={fieldName}>
                  <Typography variant="body1">
                    {fieldName.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}?
                  </Typography>
                  <Controller name={fieldName} control={control} render={({ field }) => (
                    <RadioGroup {...field} row>
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                  )} />
                </FormControl>
              ))}

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>📄 Upload Vaccination Records</Typography>
              <input type="file" onChange={(e) => setVaccinationRecords(e.target.files?.[0] || null)} accept="image/*, application/pdf" />

              <Controller name="medicalCondition" control={control} render={({ field }) => (
                <TextField {...field} label="Medical Conditions (if any)" fullWidth sx={{ mb: 2 }} />
              )} />

              <Button variant="contained" color="primary" fullWidth type="submit" sx={{ mt: 3 }}>
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
