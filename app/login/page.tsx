"use client";

import { useState } from "react";
import { auth } from "../../utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setOwner } from "@/redux/slices/ownerSlice";
import { setDogs } from "@/redux/slices/dogSlice";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false); // Toggle between login and signup
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const router = useRouter()
const dispatch=useDispatch()
  // Toggle between Login and Signup
  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
  };

  // Signup function
  const signUp = async () => {
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
     router.push("/owner-registration")

    } catch (error) {
      console.error("Error signing up:", error.message);
      setError(error.message);
    }
    setLoading(false);
  };

  // Login function
  const signIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const response = await axios.get(`/api/get-owners?email=${email}`);
      dispatch(setOwner(response.data.owners))
      dispatch(setDogs(response.data.dogs))
      router.push('/dashboard')

    } catch (error) {
      console.error("Error signing in:", error.message);
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to right, #0066ff, #33ccff)",
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={3} alignItems="center">
          {/* Left Section - Branding */}
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
              <Typography variant="h3" fontWeight="bold" color="white">
               Your Dog's Safe space
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
                  {isSignup ? "Create a New Account" : "Log in to MySocial"}
                </Typography>
                <Divider sx={{ my: 2 }} />

                {/* Signup Fields */}
                {isSignup && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          label="First Name"
                          fullWidth
                          variant="outlined"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Last Name"
                          fullWidth
                          variant="outlined"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      label="Phone Number"
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 2 }}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <TextField
                      label="Date of Birth"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      sx={{ mt: 2 }}
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </>
                )}

                {/* Common Fields */}
                
                <TextField
                  label="Email"
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

                {/* Action Button */}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3, py: 1.5, borderRadius: 2, fontWeight: "bold" }}
                  onClick={isSignup ? signUp : signIn}
                  disabled={loading}
                >
                  {loading ? "Processing..." : isSignup ? "Sign Up" : "Log In"}
                </Button>

                {/* Toggle Mode */}
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
