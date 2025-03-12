import { configureStore } from "@reduxjs/toolkit";
import ownerReducer from "./slices/ownerSlice"
import dogReducer from "./slices/dogSlice";
import bookingReducer from "./slices/bookingSlice";

export const store = configureStore({
  reducer: {
    owner: ownerReducer,
    dog: dogReducer,
    booking: bookingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
