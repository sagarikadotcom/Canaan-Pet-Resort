"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Card, CardContent, Typography, Box, Grid, Divider, Chip } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface BoardingUpdatesProps {
  selectedMonth: number;
}

export default function BoardingUpdates({ selectedMonth }: BoardingUpdatesProps) {
  const bookings = useSelector((state: RootState) => state.booking.bookings.bookings) || [];

  // Get today's and tomorrow's dates
  const today = dayjs().startOf("day");
  const tomorrow = today.add(1, "day");

  // Filter bookings for the selected month
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      if (!booking.checkInDate) return false; // Skip if check-in date is missing
      const bookingDate = dayjs.utc(booking.checkInDate).local();
      return bookingDate.isValid() && bookingDate.month() === selectedMonth;
    });
  }, [bookings, selectedMonth]);

  // Categorize bookings into sections
  const todayCheckOuts = filteredBookings.filter(
    (b) => dayjs.utc(b.checkOutDate).local().isSame(today, "day")
  );
  const todayCheckIns = filteredBookings.filter(
    (b) => dayjs.utc(b.checkInDate).local().isSame(today, "day")
  );
  const tomorrowCheckOuts = filteredBookings.filter(
    (b) => dayjs.utc(b.checkOutDate).local().isSame(tomorrow, "day")
  );
  const tomorrowCheckIns = filteredBookings.filter(
    (b) => dayjs.utc(b.checkInDate).local().isSame(tomorrow, "day")
  );
  const futureBookings = filteredBookings.filter(
    (b) =>
      !dayjs.utc(b.checkInDate).local().isSame(today, "day") &&
      !dayjs.utc(b.checkOutDate).local().isSame(today, "day") &&
      !dayjs.utc(b.checkInDate).local().isSame(tomorrow, "day") &&
      !dayjs.utc(b.checkOutDate).local().isSame(tomorrow, "day")
  );

  // Helper function to render booking cards
  const renderBookings = (bookingsArray: typeof bookings) => (
    <Grid container spacing={3}>
      {bookingsArray.map((booking, index) => {
        const owner = booking.ownerId || {};
        const dog = booking.dogId || {};

        // Parse and format check-in and check-out dates
        const checkInDateOnly = dayjs.utc(booking.checkInDate).format("YYYY-MM-DD");
        const checkInDateTime = dayjs.utc(`${checkInDateOnly} ${booking.checkInTime}`, "YYYY-MM-DD HH:mm")
          .local()
          .format("MMMM D, YYYY hh:mm A");

        const checkOutDateOnly = dayjs.utc(booking.checkOutDate).format("YYYY-MM-DD");
        const checkOutDateTime = dayjs.utc(`${checkOutDateOnly} ${booking.checkOutTime}`, "YYYY-MM-DD HH:mm")
          .local()
          .format("MMMM D, YYYY hh:mm A");

        return (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.02)", boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" },
                background: "#fff",
                p: 2,
              }}
            >
              <CardContent sx={{ textAlign: "left" }}>
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
                <Typography variant="body2" sx={{ color: "#666" }}>Gender: {dog.sex || "N/A"}</Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>Age: {dog.age ? `${dog.age} years` : "N/A"}</Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                  Booking Details
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  📅 Check-In: {checkInDateTime}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  📅 Check-Out: {checkOutDateTime}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Status Badge */}
              
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
        Boarding Updates - {dayjs().month(selectedMonth).format("MMMM")}
      </Typography>

      {filteredBookings.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center", color: "#777", mt: 3 }}>
          🚨 No bookings for this month.
        </Typography>
      ) : (
        <>
          {/* Today's Check-Outs */}
          {todayCheckOuts.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#D32F2F", mb: 2 }}>
               {` 📤 Today's Check-Outs (${todayCheckOuts.length})`}
              </Typography>
              {renderBookings(todayCheckOuts)}
            </Box>
          )}

          {/* Today's Check-Ins */}
          {todayCheckIns.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#388E3C", mb: 2 }}>
                {`📥 Today's Check-Ins (${todayCheckIns.length})`}
              </Typography>
              {renderBookings(todayCheckIns)}
            </Box>
          )}

          {/* Tomorrow's Check-Outs & Check-Ins */}
          {(tomorrowCheckIns.length > 0) && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#FFA000", mb: 2 }}>
                {`🔜 Tomorrow's Check-Ins (${tomorrowCheckIns.length})`}
              </Typography>
              {renderBookings([...tomorrowCheckIns, ...tomorrowCheckOuts])}
            </Box>
          )}

{tomorrowCheckOuts.length > 0  && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#388E3C", mb: 2 }}>
                {`📥 Tomorrow's Check-Outs (${tomorrowCheckOuts.length})`}
              </Typography>
              {renderBookings(tomorrowCheckOuts)}
            </Box>
          )}

          {/* Other Future Bookings */}
          {futureBookings.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1565C0", mb: 2 }}>
                📅 Upcoming Bookings
              </Typography>
              {renderBookings(futureBookings)}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
