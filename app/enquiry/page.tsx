"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Slider,
} from "@mui/material";

export default function EnquiryForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dogName: "",
    dogBreed: "",
    dogDOB: "",
    dogGender: "",
    dogWeight: 0,
    neutered: "",
    dogAgeAtAdoption: "",
    healthConditions: "",
    foodAllergies: "",
    temperament: "",
    vaccinationRecord: null,
    dewormingRecord: null,
    reactivity: {},
    aggression: {
      incidents: "",
      familyAggression: "",
      visitorAggression: "",
      recentIncident: "",
      resolutionMethods: "",
      foodAggression: false,
      toyAggression: false,
      pettingAggression: false,
      dogAggression: false,
      incidentWithDog: false,
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        aggression: {
          ...formData.aggression,
          [name]: checked,
        },
      });
    } else if (name === "dogWeight") {
      setFormData({ ...formData, [name]: Number(value) });
    } else if (name === "incidents") {
      setFormData({
        ...formData,
        aggression: {
          ...formData.aggression,
          incidents: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleReactivityChange = (field, value) => {
    setFormData({
      ...formData,
      reactivity: { ...formData.reactivity, [field]: value },
    });
  };

  const submitEnquiry = async () => {
    try {
      if (!formData.email.includes("@")) {
        alert("Invalid Email");
        return;
      }
      if (isNaN(formData.dogWeight) || formData.dogWeight <= 0) {
        alert("Please enter a valid weight");
        return;
      }

      const data = new FormData();

      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("dogName", formData.dogName);
      data.append("dogBreed", formData.dogBreed);
      data.append("dogDOB", formData.dogDOB);
      data.append("dogGender", formData.dogGender);
      data.append("dogWeight", formData.dogWeight.toString());
      data.append("neutered", formData.neutered);
      data.append("dogAgeAtAdoption", formData.dogAgeAtAdoption);
      data.append("healthConditions", formData.healthConditions);
      data.append("foodAllergies", formData.foodAllergies);
      data.append("temperament", formData.temperament);
      data.append("reactivity", JSON.stringify(formData.reactivity));
      data.append("aggression", JSON.stringify(formData.aggression));

      if (formData.vaccinationRecord) {
        data.append("vaccinationRecord", formData.vaccinationRecord);
      }
      if (formData.dewormingRecord) {
        data.append("dewormingRecord", formData.dewormingRecord);
      }

      const response = await fetch("/api/enquiry", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit enquiry");
      }

      const result = await response.json();
      alert("Enquiry submitted successfully!");
      return result;
    } catch (error) {
      console.error("Submission error:", error.message);
      alert("Error: " + error.message);
    }
  };

  return (
    <Box p={3} maxWidth={800} mx="auto">
      <Typography variant="h4" gutterBottom>
        Enquiry Form
      </Typography>
      <form>
        <Typography variant="h6">Personal Information</Typography>
        <TextField label="First Name" name="firstName" fullWidth margin="normal" onChange={handleChange} required />
        <TextField label="Last Name" name="lastName" fullWidth margin="normal" onChange={handleChange} required />
        <TextField label="Email" name="email" type="email" fullWidth margin="normal" onChange={handleChange} required />
        <TextField label="Phone Number" name="phone" fullWidth margin="normal" onChange={handleChange} required />

        <Typography variant="h6" mt={3}>Dog's Information</Typography>
        <TextField label="Dog's Name" name="dogName" fullWidth margin="normal" onChange={handleChange} required />
        <TextField label="Dog's Breed" name="dogBreed" fullWidth margin="normal" onChange={handleChange} required />
        <TextField label="Dog's DOB" name="dogDOB" type="date" fullWidth margin="normal" onChange={handleChange} InputLabelProps={{ shrink: true }} required />
        <TextField label="Dog's Weight (kg)" name="dogWeight" type="number" fullWidth margin="normal" onChange={handleChange} required />
        <TextField label="Age when adopted" name="dogAgeAtAdoption" fullWidth margin="normal" onChange={handleChange} required />

        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Dog's Gender</FormLabel>
          <RadioGroup row name="dogGender" onChange={handleChange}>
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Is your dog neutered/spayed?</FormLabel>
          <RadioGroup row name="neutered" onChange={handleChange}>
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>

        <Typography variant="h6" mt={3}>Health Information</Typography>
        <TextField label="Health Conditions & Medications" name="healthConditions" fullWidth margin="normal" onChange={handleChange} required />
        <TextField label="Food Allergies" name="foodAllergies" fullWidth margin="normal" onChange={handleChange} required />
        <TextField label="Dog's Temperament" name="temperament" fullWidth margin="normal" multiline rows={3} onChange={handleChange} required />
        <Box mt={2}>
          <Typography>Vaccination Record</Typography>
          <input type="file" name="vaccinationRecord" onChange={handleChange} />
        </Box>
        <Box mt={2}>
          <Typography>Deworming Record</Typography>
          <input type="file" name="dewormingRecord" onChange={handleChange} />
        </Box>

        <Typography variant="h6" mt={3}>Reactivity Assessment</Typography>
        {[
          "Familiar dogs on property",
          "Familiar dogs off property",
          "New dogs on property",
          "New dogs off property",
          "Strangers outside on property",
          "Strangers off property",
          "Strangers arriving indoors",
          "Car Rides",
          "Fireworks/Thunderstorms/Loud Noises",
          "Motorbikes/Scooters",
          "Cycles",
          "Cars/Trucks/Tractors",
          "Large Groups of people",
          "Cattle/Sheep/Goats/Horses",
        ].map((label) => (
          <Box key={label} mt={2}>
            <Typography>{label}</Typography>
            <Slider
              defaultValue={3}
              min={1}
              max={5}
              step={1}
              valueLabelDisplay="auto"
              onChange={(e, value) => handleReactivityChange(label, value)}
            />
          </Box>
        ))}

        <Typography variant="h6" mt={3}>Aggression Assessment</Typography>
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Any incidents of aggressive behaviour?</FormLabel>
          <RadioGroup row name="incidents" onChange={handleChange}>
            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>

        {formData.aggression.incidents === "Yes" && (
          <>
            <TextField label="Aggression to family" name="familyAggression" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Aggression to visitors" name="visitorAggression" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Most recent incident" name="recentIncident" fullWidth margin="normal" onChange={handleChange} />
            <TextField label="Resolution methods used" name="resolutionMethods" fullWidth margin="normal" onChange={handleChange} />

            <FormControlLabel control={<Checkbox name="foodAggression" onChange={handleChange} />} label="Aggression over food" />
            <FormControlLabel control={<Checkbox name="toyAggression" onChange={handleChange} />} label="Aggression over toys" />
            <FormControlLabel control={<Checkbox name="pettingAggression" onChange={handleChange} />} label="Aggression when petted" />
            <FormControlLabel control={<Checkbox name="dogAggression" onChange={handleChange} />} label="Aggression towards other dogs" />
            <FormControlLabel control={<Checkbox name="incidentWithDog" onChange={handleChange} />} label="Incident with another dog" />
          </>
        )}

        <Box mt={3}>
          <Button variant="contained" color="primary" onClick={submitEnquiry}>
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
