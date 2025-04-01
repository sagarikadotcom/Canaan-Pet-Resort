"use client";

import { Key, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { updateBookingStatus } from "@/redux/slices/bookingSlice";
import { 
  Card, CardContent, Typography, Box, Avatar, Grid, Button, Divider, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, TextField 
} from "@mui/material";
import dayjs from "dayjs";
import { setOwner } from "@/redux/slices/ownerSlice";
import { addDog } from "@/redux/slices/dogSlice";
import AddDog from "../add-dog/page";

export default function BookingList() {
  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.booking.bookings.bookings) || [];
  const owner = useSelector((state: RootState) => state.owner.owner) || "";

  const [selectedTab, setSelectedTab] = useState(0);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectBookingId, setRejectBookingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search input state

  // Categorize bookings
  const pendingBookings = bookings.filter((b: { status: string; }) => b.status === "Pending");
  const confirmedBookings = bookings.filter((b: { status: string; }) => b.status === "Confirmed");
  const rejectedBookings = bookings.filter((b: { status: string; }) => b.status === "Rejected");

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleStatusChange = async (booking: string,  status: "Confirmed" | "Rejected") => {
    
    try {
      const response = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking._id,
          status,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
      //  dispatch(updateBookingStatus({ id, status }));
  console.log("booking",booking)
        if (status === "Confirmed") {
          const ownerResponse = await fetch(`/api/get-owners?bookingId=${booking._id}`);
        
          const ownerData = await ownerResponse.json();
            if (ownerResponse.ok) {
            dispatch(setOwner(ownerData.owner));
            //dispatch(AddDog(dogData))
            const message = `Your booking for ${booking.dogId.name} has been confirmed! 🐶\nCheck-in: ${dayjs(booking.checkInDate).format("DD MMM YYYY")} at ${booking.checkInTime}\nCheck-out: ${dayjs(booking.checkOutDate).format("DD MMM YYYY")} at ${booking.checkOutTime}\nThank you!`;
            window.open(`https://wa.me/+91${booking.ownerId.phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
   
          } else {
            console.error("Failed to fetch owner details:", ownerData.error);
          }
        }
      } else {
        console.error("Error updating booking:", data.error);
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };
  


 // 📌 Open reject pop-up
 const openRejectDialog = (id: string) => {
  setRejectBookingId(id);
  setRejectDialogOpen(true);
};

// 📌 Handle reject confirmation
const confirmRejection = async () => {
  if (!rejectBookingId) return;
  await handleStatusChange(rejectBookingId, "Rejected");
  setRejectDialogOpen(false);
  setRejectReason("");
};

  // Get current bookings based on selected tab
  const getCurrentBookings = () => {
    if (selectedTab === 0) return pendingBookings;
    if (selectedTab === 1) return confirmedBookings;
    if (selectedTab === 2) return rejectedBookings;
    return [];
  };

  const currentBookings = getCurrentBookings();

  // 📌 Filter bookings based on search query
  const filteredBookings = currentBookings.filter((booking: { ownerId: {}; dogId: {}; }) => {
    const owner = booking.ownerId || {};
    const dog = booking.dogId || {};
    const query = searchQuery.toLowerCase();

    return (
      owner.firstName?.toLowerCase().includes(query) ||
      owner.lastName?.toLowerCase().includes(query) ||
      owner.phoneNumber?.includes(query) ||
      dog.name?.toLowerCase().includes(query)
    );
  });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3, fontWeight: "bold", color: "#333" }}>
        Booking List
      </Typography>

      {/* Search Input */}
      <TextField
        label="Search by Owner Name, Phone Number, or Dog Name"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Tabs for filtering bookings */}
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label={`Pending (${pendingBookings.length})`} />
        <Tab label={`Confirmed (${confirmedBookings.length})`} />
        <Tab label={`Rejected (${rejectedBookings.length})`} />
      </Tabs>

      {/* If no bookings in the current category */}
      {filteredBookings.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="h6" sx={{ color: "#555" }}>🚨 No bookings found.</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {filteredBookings.map((booking: { ownerId: {}; dogId: {}; checkInDate: string | number | Date | dayjs.Dayjs | null | undefined; checkOutDate: string | number | Date | dayjs.Dayjs | null | undefined; status: string; _id: string; }, index: Key | null | undefined) => {
            const owner = booking.ownerId || {};
            const dog = booking.dogId || {};

            const checkInDate = dayjs(booking.checkInDate).format("DD MMM YYYY");
            const checkOutDate = dayjs(booking.checkOutDate).format("DD MMM YYYY");

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
                      {owner.firstName || "Unknown"} {owner.lastName || ""}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      📞 {owner.phoneNumber || "N/A"}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff9800" }}>
                      {dog.name || "Unknown"} ({dog.breed || "Unknown Breed"})
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                      Booking Details
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      📅 Check-In: {checkInDate}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      📅 Check-Out: {checkOutDate}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {booking.status === "Pending" && (

                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Button variant="contained" color="success" sx={{ flex: 1, mx: 1 }} onClick={() => handleStatusChange(booking, "Confirmed")}>
                          Accept
                        </Button>
                        <Button variant="contained" color="error" sx={{ flex: 1, mx: 1 }} onClick={() => openRejectDialog(booking)}>
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
       {/* Reject Dialog */}
       <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Booking</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for rejection"
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmRejection} color="error">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
