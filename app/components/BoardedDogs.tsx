"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setBookings, updateBookingStatus } from "@/redux/slices/bookingSlice";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Divider,
  Grid,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import dayjs from "dayjs";

export default function BoardedDogs() {
  const dispatch = useDispatch();
  const bookings = useSelector((state: RootState) => state.booking.bookings.bookings) || [];
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    fetchCheckedInBookings();
  }, []);

  const fetchCheckedInBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings?status=CheckedIn");
      const data = await res.json();
      if (res.ok) {
        dispatch(setBookings(data.bookings));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching checked-in bookings:", error);
    }
    setLoading(false);
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: selectedBooking._id, status: "Completed" }),
      });

      if (res.ok) {
        dispatch(updateBookingStatus({ id: selectedBooking._id, status: "Completed" }));
        setOpenDialog(false);
      } else {
        console.error("Failed to complete checkout");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };


  const openCheckoutDialog = (booking: any) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (bookings.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6">🚨 No boarded dogs found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        🐶 Boarded Dogs ({bookings.length})
      </Typography>
      <Grid container spacing={3}>
        {bookings.map((booking) => {
          const owner = booking.ownerId || {};
          const dog = booking.dogId || {};
          const checkIn = dayjs(booking.checkInDate).format("MMM D, YYYY hh:mm A");
          const checkOut = dayjs(booking.checkOutDate).format("MMM D, YYYY");

          return (
            <Grid item key={booking._id} xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                    Owner: {owner.firstName} {owner.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    📞 {booking.ownerId.phoneNumber}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" color="primary">
                    {dog.name} ({dog.breed})
                  </Typography>
                  <Typography variant="body2">Age: {dog.age || "N/A"}</Typography>
                  <Typography variant="body2">Sex: {dog.sex || "N/A"}</Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2">
                    Check-in: {dayjs(booking.checkInDate).format("MMM D, YYYY")}
                  </Typography>
                  <Typography variant="body2">Check-out: {booking.checkOutDate}</Typography>

                  <Divider sx={{ my: 2 }} />

                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => openCheckoutDialog(booking)}
                  >
                    Check Out
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Checkout Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Check-Out</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to check out {selectedBooking?.dogId?.name || "this dog"} owned by{" "}
            {selectedBooking?.ownerId?.firstName} {selectedBooking?.ownerId?.lastName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
