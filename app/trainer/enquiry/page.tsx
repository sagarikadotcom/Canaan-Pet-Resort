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
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function TrainerEnquiryForm() {
  const router=useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    source: "",
    instagram: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/trainer-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }
router.push("/")
      alert("Enquiry submitted successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        source: "",
        instagram: "",
      });
    } catch (error) {
      console.error(error);
      alert("Error submitting enquiry");
    }
  };

  return (
    <Box p={3} maxWidth={600} mx="auto">
      <Typography variant="h5" mb={3}>
        Train The Trainer Enquiry Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="First Name"
          name="firstName"
          fullWidth
          margin="normal"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Last Name"
          name="lastName"
          fullWidth
          margin="normal"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Phone Number"
          name="phone"
          fullWidth
          margin="normal"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Where did you get our information?</FormLabel>
          <RadioGroup
            name="source"
            value={formData.source}
            onChange={handleChange}
            row
          >
            <FormControlLabel value="Instagram" control={<Radio />} label="Instagram" />
            <FormControlLabel value="Website" control={<Radio />} label="Website" />
            <FormControlLabel value="Friend" control={<Radio />} label="Friend" />
            <FormControlLabel value="Other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl>

        <TextField
          label="Instagram Handle"
          name="instagram"
          fullWidth
          margin="normal"
          value={formData.instagram}
          onChange={handleChange}
        />

        <Box mt={3}>
          <Button variant="contained" type="submit" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}
