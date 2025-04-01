"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { TextField, Button,Typography, CircularProgress, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
//import { setOwner, setOwnerID } from "@/redux/slices/ownerSlice";
import { setDogs } from "@/redux/slices/dogSlice";
import { setOwner } from "@/redux/slices/ownerSlice";

interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}


export default function PhoneLookup() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ownerData, setOwnerData] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSearch = async () => {
    if (!phoneNumber) return setError("Please enter a phone number");
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`/api/get-owners?phoneNumber=${phoneNumber}`);
      dispatch(setOwner(response.data.owners))
      dispatch(setDogs(response.data.dogs))
    console.log("ownerData",ownerData)
     //dispatch(setOwner(response.data))
      //dispatch(setOwnerID(response.data._id))
     // dispatch(setDogs(response.data.dogs))
      router.push("/dashboard")
    } catch (err) {
      console.log(err)
      setOwnerData(null);
      setError("Owner not found! Redirecting to registration...");
      setTimeout(() => router.push("/owner-registration"), 2000);
    } finally {
      setLoading(false);
    }
   
  
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Enter Phone Number
        </Typography>
        <TextField
          label="Phone Number"
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={{ width: "300px", mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
        </Button>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </motion.div>

     
    </Box>
  );
}
