"use client";

import { useState, useMemo, useEffect, Key } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface BoardingUpdatesProps {
  selectedMonth: number;
}

interface Booking {
  _id: string;
  ownerId: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  dogId: {
    name: string;
    breed: string;
    sex: string;
    age: number;
  };
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
}

export default function BoardingUpdates({ selectedMonth }: BoardingUpdatesProps) {
  const bookings = useSelector((state: RootState) => {
    return state.booking.bookings.bookings || [];
  });

  const today = dayjs().startOf("day");
  const tomorrow = dayjs().add(1, "day").startOf("day");

  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [kennels, setKennels] = useState<any[]>([]);
  const [selectedGuardian, setSelectedGuardian] = useState("");
  const [selectedKennel, setSelectedKennel] = useState("");
  const [selectedSubKennel, setSelectedSubKennel] = useState("");
  const [checkItems, setCheckItems] = useState({
    leash: false,
    bed: false,
    bowl: false,
    toys: false,
    medicines: false,
    addInstructions: false,
    instructions: "",
  });

  const categorizedBookings = useMemo(() => {
    const categories = {
      checkInToday: [] as Booking[],
      checkOutToday: [] as Booking[],
      checkInTomorrow: [] as Booking[],
      checkOutTomorrow: [] as Booking[],
      upcoming: [] as Booking[],
    };

    (bookings || []).forEach((booking: Booking) => {
      const checkIn = dayjs.utc(booking.checkInDate).local().startOf("day");
      const checkOut = dayjs.utc(booking.checkOutDate).local().startOf("day");

      if (checkIn.isSame(today, "day")) categories.checkInToday.push(booking);
      if (checkOut.isSame(today, "day")) categories.checkOutToday.push(booking);
      if (checkIn.isSame(tomorrow, "day")) categories.checkInTomorrow.push(booking);
      if (checkOut.isSame(tomorrow, "day")) categories.checkOutTomorrow.push(booking);
      if (checkIn.isAfter(tomorrow, "day")) categories.upcoming.push(booking);
    });

    return categories;
  }, [bookings, today, tomorrow]);

  const fetchKennels = async () => {
    try {
      const res = await fetch("/api/get-kennels");
      const data = await res.json();
      console.log("data.kennels",data.kennels)
      setKennels(data.kennels || []);
    } catch (err) {
      console.error("Error fetching kennels:", err);
    }
  };

  useEffect(() => {
    if (openModal) fetchKennels();
  }, [openModal]);

  const handleCheckInClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setOpenModal(true);
  };

  const updateCheckInDetails = async () => {
    if (!selectedBooking) return;
  
    try {
      const payload = {
        checkinDetails: {
          guardian: selectedGuardian,
          kennel: selectedKennel,
          subKennel: selectedSubKennel,
          items: {
            leash: checkItems.leash,
            bed: checkItems.bed,
            bowl: checkItems.bowl,
            toys: checkItems.toys,
            medicines: checkItems.medicines,
            instructions: checkItems.addInstructions ? checkItems.instructions : "",
          },
        },
        bookingStatus: "CheckedIn",
      };
  
      const res = await fetch(`/api/bookings/${selectedBooking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update check-in");
      }
  
      alert("Check-In marked successfully!");
      setOpenModal(false);
    } catch (err: any) {
      console.error("Check-In Error:", err.message);
      alert("Error: " + err.message);
    }
  };
  

  const renderBookings = (title: string, bookingsArray: Booking[]) => {
    if (!bookingsArray.length) return null;
    return (
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#333" }}>
          {title}
        </Typography>
        <Grid container spacing={3}>
          {bookingsArray.map((booking: Booking, index: Key) => {
            const checkInDateTime = dayjs
              .utc(booking.checkInDate)
              .local()
              .format("MMM D, YYYY hh:mm A");
            const checkOutDateTime = dayjs
              .utc(booking.checkOutDate)
              .local()
              .format("MMM D, YYYY hh:mm A");

            return (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: "0.3s",
                    background: "#fafafa",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#1976d2" }}>
                        {booking.ownerId.firstName} {booking.ownerId.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📞 {booking.ownerId.phoneNumber}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 500, color: "#333" }}>
                        🐶 {booking.dogId.name} ({booking.dogId.breed})
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        📅 Check-In: {checkInDateTime}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📅 Check-Out: {checkOutDateTime}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Button
                        variant="outlined"
                        fullWidth
                        size="small"
                        sx={{ textTransform: "none" }}
                        onClick={() => handleCheckInClick(booking)}
                      >
                        Mark Check-In
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 3, mb: 5 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "#1976d2" }}
      >
        Boarding Updates - {dayjs().month(selectedMonth).format("MMMM")}
      </Typography>

      {renderBookings("Check-In Today", categorizedBookings.checkInToday)}
      {renderBookings("Check-Out Today", categorizedBookings.checkOutToday)}
      {renderBookings("Check-In Tomorrow", categorizedBookings.checkInTomorrow)}
      {renderBookings("Check-Out Tomorrow", categorizedBookings.checkOutTomorrow)}
      {renderBookings("Upcoming Boarding", categorizedBookings.upcoming)}

      {/* Check-In Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
  <DialogTitle>Check-In Details</DialogTitle>
  <DialogContent>
    {/* Guardian Dropdown */}
    <FormControl fullWidth margin="normal">
      <InputLabel>Guardian</InputLabel>
      <Select
        value={selectedGuardian}
        onChange={(e) => {
          setSelectedGuardian(e.target.value);
          setSelectedKennel("");
          setSelectedSubKennel("");
        }}
      >
        {[...new Set(kennels.map((k) => k.guardianName))].map((guardian) => (
          <MenuItem key={guardian} value={guardian}>
            {guardian}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* Kennel Dropdown */}
    {selectedGuardian && (
      <FormControl fullWidth margin="normal">
        <InputLabel>Kennel</InputLabel>
        <Select
          value={selectedKennel}
          onChange={(e) => {
            setSelectedKennel(e.target.value);
            setSelectedSubKennel("");
          }}
        >
          {kennels
            .filter((k) => k.guardianName === selectedGuardian)
            .map((kennel) => (
              <MenuItem key={kennel._id} value={kennel.name}>
                {kennel.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    )}

    {/* Sub-Kennel Dropdown */}
    {selectedKennel && (
      <FormControl fullWidth margin="normal">
        <InputLabel>Sub-Kennel</InputLabel>
        <Select
          value={selectedSubKennel}
          onChange={(e) => setSelectedSubKennel(e.target.value)}
        >
          {kennels
            .find((k) => k.name === selectedKennel)
            ?.subKennels.map((sub: any) => (
              <MenuItem key={sub._id} value={sub.number}>
                Sub-Kennel {sub.number}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    )}

    {/* Items Checkboxes */}
    <FormGroup sx={{ mt: 2 }}>
      {["leash", "bed", "bowl", "toys", "medicines"].map((item) => (
        <FormControlLabel
          key={item}
          control={
            <Checkbox
              checked={checkItems[item as keyof typeof checkItems]}
              onChange={(e) =>
                setCheckItems({ ...checkItems, [item]: e.target.checked })
              }
            />
          }
          label={item.charAt(0).toUpperCase() + item.slice(1)}
        />
      ))}

      <FormControlLabel
        control={
          <Checkbox
            checked={checkItems.addInstructions}
            onChange={(e) =>
              setCheckItems({ ...checkItems, addInstructions: e.target.checked })
            }
          />
        }
        label="Add Instructions"
      />
    </FormGroup>

    {checkItems.addInstructions && (
      <TextField
        label="Instructions"
        fullWidth
        margin="normal"
        multiline
        rows={3}
        value={checkItems.instructions}
        onChange={(e) =>
          setCheckItems({ ...checkItems, instructions: e.target.value })
        }
      />
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenModal(false)}>Cancel</Button>
    <Button
      variant="contained"
      onClick={updateCheckInDetails}
      disabled={!selectedSubKennel}
    >
      OK
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}
