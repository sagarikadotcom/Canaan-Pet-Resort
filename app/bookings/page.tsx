"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { addBooking, setBookings } from "@/redux/slices/bookingSlice";
import { 
  Box, Typography, Paper, TextField, Button, Container, Divider, CircularProgress 
} from "@mui/material";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // Extract dogId from URL
  const dogId = searchParams.get("dogId");

  // Fetch Owner & Dog from Redux
  const owner = useSelector((state: RootState) => state.owner.owner);
  const dogs = useSelector((state: RootState) => state.dog.dogs);
  const dog = dogs.find((d) => d._id === dogId);

  // State for form fields
  const [checkInDate, setCheckInDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if the dog is invalid
  useEffect(() => {
    if (!dog) {
      alert("Invalid Dog! Redirecting to dashboard.");
      router.push("/dashboard");
    }
  }, [dog, router]);

  const handleBooking = async () => {
    if (!checkInDate || !checkInTime || !checkOutDate || !checkOutTime || !dog || !owner) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    const bookingData = {
      ownerId: owner.ownerId,
      dogId: dogId,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
    };

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json(); // ✅ Ensures response is properly parsed

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking."); // ✅ Gets error message from API
      }

     dispatch(setBookings(data)); // ✅ Uses API response instead of request payload
      alert("🎉 Booking confirmed!");
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Booking Error:", error);
      setError(error.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #84fab0, #8fd3f4)", // Vibrant Gradient
        p: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={10} 
          sx={{ 
            p: 4, 
            borderRadius: 3, 
            textAlign: "center", 
            boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", 
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)"
          }}
        >
          {/* Title */}
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}>
            📅 Book Your Stay
          </Typography>

          {/* Dog Info */}
          {dog && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>🐶 {dog.name}</Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>Breed: {dog.breed}</Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>Age: {dog.age} years</Typography>
            </Box>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Booking Form */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField 
              label="Check-in Date" 
              type="date" 
              fullWidth 
              InputLabelProps={{ shrink: true }} 
              onChange={(e) => setCheckInDate(e.target.value)} 
            />
            <TextField 
              label="Check-in Time" 
              type="time" 
              fullWidth 
              InputLabelProps={{ shrink: true }} 
              onChange={(e) => setCheckInTime(e.target.value)} 
            />
            <TextField 
              label="Check-out Date" 
              type="date" 
              fullWidth 
              InputLabelProps={{ shrink: true }} 
              onChange={(e) => setCheckOutDate(e.target.value)} 
            />
            <TextField 
              label="Check-out Time" 
              type="time" 
              fullWidth 
              InputLabelProps={{ shrink: true }} 
              onChange={(e) => setCheckOutTime(e.target.value)} 
            />
          </Box>

          {/* Error Message */}
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {/* Confirm Button */}
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 3, fontWeight: "bold", py: 1.5, borderRadius: 2 }} 
            onClick={handleBooking}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "✅ Confirm Booking"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
