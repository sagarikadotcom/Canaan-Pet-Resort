import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Booking {
  ownerId: string;
  dogId: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  status:string
}

interface BookingState {
  bookings: Booking[]; // ✅ Ensure `bookings` is an array
}

const initialState: BookingState = {
  bookings: [], // ✅ Default to an empty array
};

export const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
  console.log("action.payload",action.payload)

      state.bookings = action.payload; // ✅ Ensure we store an array
    },
    updateBookingStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const { id, status } = action.payload;
      console.log("bookings")
      const booking = state.bookings.find((b) => b.id === id);
      if (booking) {
        booking.status = status;
      }
  },
}
});

export const { setBookings,updateBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;


