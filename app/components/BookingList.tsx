"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { updateBookingStatus } from "@/redux/slices/bookingSlice"; // Redux action
import { 
  Card, CardContent, Typography, Box, Avatar, Grid, Button, Divider, Tabs, Tab 
} from "@mui/material";
import dayjs from "dayjs";

export default function BookingList() {
  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.booking.bookings.bookings) || [];
  const [selectedTab, setSelectedTab] = useState(0);

  // Categorize bookings
  const pendingBookings = bookings.filter((b) => b.status === "Pending");
  const confirmedBookings = bookings.filter((b) => b.status === "Confirmed");
  const rejectedBookings = bookings.filter((b) => b.status === "Rejected");

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Handle status change
  const handleStatusChange = async (id: string, status: "Confirmed" | "Rejected") => {
    try {
      const response = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: id,
          status,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        dispatch(updateBookingStatus({ id, status }));
      } else {
        console.error("Error updating booking:", data.error);
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  // Get current bookings based on selected tab
  const getCurrentBookings = () => {
    if (selectedTab === 0) return pendingBookings;
    if (selectedTab === 1) return confirmedBookings;
    if (selectedTab === 2) return rejectedBookings;
    return [];
  };

  const currentBookings = getCurrentBookings();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3, fontWeight: "bold", color: "#333" }}>
        Booking List
      </Typography>

      {/* Tabs for filtering bookings */}
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label={`Pending (${pendingBookings.length})`} />
        <Tab label={`Confirmed (${confirmedBookings.length})`} />
        <Tab label={`Rejected (${rejectedBookings.length})`} />
      </Tabs>

      {/* If no bookings in the current category */}
      {currentBookings.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h6" sx={{ color: "#555" }}>🚨 No bookings available.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {currentBookings.map((booking, index) => {
            const owner = booking.owner || {};
            const dog = booking.dog || {};

            const checkInDate = booking.checkInDate ? dayjs(booking.checkInDate).format("DD MMM YYYY") : "N/A";
            const checkInTime = booking.checkInTime ? dayjs(booking.checkInTime, "HH:mm").format("hh:mm A") : "N/A";
            const checkOutDate = booking.checkOutDate ? dayjs(booking.checkOutDate).format("DD MMM YYYY") : "N/A";
            const checkOutTime = booking.checkOutTime ? dayjs(booking.checkOutTime, "HH:mm").format("hh:mm A") : "N/A";

            return (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.02)", boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" },
                  background: "#fff",
                  p: 2,
                }}>
                  <CardContent sx={{ textAlign: "left" }}>
                    <Avatar 
                      src={dog.profilePicture || "/default-dog.png"} 
                      sx={{ width: 90, height: 90, margin: "auto", mb: 2, border: "3px solid #f1f1f1" }} 
                    />

                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", mb: 1 }}>
                      {booking.ownerId.firstName || "Unknown"} {booking.ownerId.lastName || ""}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      📞 {booking.ownerId.phoneNumber || "N/A"}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff9800" }}>
                      {booking.dogId.name || "Unknown"} ({booking.dogId.breed || "Unknown Breed"})
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>Gender: {booking.dogId.sex || "N/A"}</Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>Age: {booking.dogId.age ? `${booking.dogId.age} years` : "N/A"}</Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                      Booking Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      📅 Check-In: {checkInDate} at {checkInTime}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      📅 Check-Out: {checkOutDate} at {checkOutTime}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Status */}
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        color: booking.status === "Confirmed" ? "green" :
                               booking.status === "Rejected" ? "red" :
                               "gray",
                        textAlign: "center",
                        mb: 2
                      }}
                    >
                      Status: {booking.status || "Pending"}
                    </Typography>

                    {/* Approve & Reject Buttons (only show for Pending) */}
                    {booking.status === "Pending" && (
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          sx={{ flex: 1, mx: 1 }}
                          onClick={() => handleStatusChange(booking._id, "Confirmed")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          sx={{ flex: 1, mx: 1 }}
                          onClick={() => handleStatusChange(booking._id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </Box>
                    )}

                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
