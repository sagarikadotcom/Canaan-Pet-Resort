"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {
  Box, Button, Container, Grid, Paper, TextField, Typography, Divider, Stepper, Step, StepLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setOwner } from "@/redux/slices/ownerSlice";
import { setDogs } from "@/redux/slices/dogSlice";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
 // const [error, setError] = useState("");

  // Login & Signup fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Owner Registration fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [alternateContact, setAlternateContact] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [addressProof, setAddressProof] = useState(null);

  const router = useRouter();
  const dispatch = useDispatch();

  // 🔹 Toggle between Login & Signup
  const toggleMode = () => {
    setIsSignup(!isSignup);
    setStep(0); // Removed unused setError("")
  };

  // 🔹 Login Function
  const signIn = async () => {
    setLoading(true);
    if(email==="hello@canaanpetresort.com")
{
router.push("/admin-dashboard")
}   else{ try {
      await signInWithEmailAndPassword(auth, email, password);

      // Get owner details
      const response = await axios.get(`/api/get-owners?email=${email}`);
      dispatch(setOwner(response.data.owners));
      dispatch(setDogs(response.data.dogs));

      // Redirect to Dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login Error:", error.message);
     // setError(error.message);
    }}
    setLoading(false);
  };

  // 🔹 Signup Function (Step 1)
  const signUp = async () => {
    setLoading(true);
    //setError("");//
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setStep(1); // Move to Owner Registration Step
    } catch (error) {
      console.error("Signup Error:", error.message);
    //  setError(error.message);
    }
    setLoading(false);
  };

  // 🔹 Upload File Function
  const uploadFile = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.fileUrl;
  };

  // 🔹 Owner Registration Function (Step 2)
  const registerOwner = async () => {
    setLoading(true);
  //  setError("");

    try {
      const profilePicUrl = await uploadFile(profilePicture);
      const addressProofUrl = await uploadFile(addressProof);

      const ownerData = {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        dob,
        address,
        instagramHandle,
        alternateContactName: alternateContact,
        alternatePhoneNumber: alternatePhone,
        profilePicture: profilePicUrl,
        addressProof: addressProofUrl,
      };

      // Store Owner Data
      const response = await fetch("/api/owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ownerData),
      });

      if (!response.ok) throw new Error("Failed to register owner");

      // Fetch Updated Owner Data
      const ownersData = await axios.get(`/api/get-owners?email=${email}`);
      dispatch(setOwner(ownersData.data.owners));
      dispatch(setDogs(ownersData.data.dogs));

      // Redirect to Dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Owner Registration Error:", error.message);
    //  setError(error.message);
    }

    setLoading(false);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "linear-gradient(to right, #0066ff, #33ccff)", }}>
      <Container maxWidth="md">
        <Grid container spacing={3} alignItems="center">
          {/* Left Section - Branding */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
              <Typography variant="h3" fontWeight="bold" color="white">
                {"Your Dog's Safe Space"}
              </Typography>
              <Typography variant="h6" color="white" sx={{ mt: 1 }}>
                Connect with us and the world of dogs.
              </Typography>
            </motion.div>
          </Grid>

          {/* Right Section - Auth Form */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3, textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold">
                  {isSignup ? "Create a New Account" : "Log in to Your Account"}
                </Typography>
                <Divider sx={{ my: 2 }} />

                {/* Stepper for Signup */}
                {isSignup && (
                  <Stepper activeStep={step} sx={{ mb: 3 }}>
                    <Step><StepLabel>Sign Up</StepLabel></Step>
                    <Step><StepLabel>Owner Details</StepLabel></Step>
                  </Stepper>
                )}

                {isSignup && step === 1 ? (
                  <>
                     <TextField label="First Name" fullWidth sx={{ mt: 2 }} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <TextField label="Last Name" fullWidth sx={{ mt: 2 }} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <TextField label="Phone Number" fullWidth sx={{ mt: 2 }} value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <TextField label="Date of Birth" type="date" fullWidth sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} value={dob} onChange={(e) => setDob(e.target.value)} />
                    <TextField label="Instagram Handle" fullWidth sx={{ mt: 2 }} value={instagramHandle} onChange={(e) => setInstagramHandle(e.target.value)} />
                    <TextField label="Address" fullWidth sx={{ mt: 2 }} value={address} onChange={(e) => setAddress(e.target.value)} />
                    <TextField label="Alternate Contact Name" fullWidth sx={{ mt: 2 }} value={alternateContact} onChange={(e) => setAlternateContact(e.target.value)} />
                    <TextField label="Alternate Phone Number" fullWidth sx={{ mt: 2 }} value={alternatePhone} onChange={(e) => setAlternatePhone(e.target.value)} />
                    
                    {/* File Uploads */}
                    <div>
                    <Typography variant="h6" sx={{ mb: 2 }}>Upload Profile Picture</Typography>
                    <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} accept="image/*" />

                    </div>
                  <div>
                  <Typography variant="h6" sx={{ mb: 2 }}>Upload Profile Picture</Typography>
                    <input type="file" onChange={(e) => setAddressProof(e.target.files[0])} accept="image/*, application/pdf" />

                  </div>
                    <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={registerOwner} disabled={loading}>
                      {loading ? "Processing..." : "Complete Registration"}
                    </Button>
                  </>
                ) : (
                  <>
                    <TextField label="Email" fullWidth sx={{ mt: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField label="Password" type="password" fullWidth sx={{ mt: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={isSignup ? signUp : signIn} disabled={loading}>
                      {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
                    </Button>
                  </>
                )}

                <Typography sx={{ mt: 2, cursor: "pointer", color: "#007bff" }} onClick={toggleMode}>
                  {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
