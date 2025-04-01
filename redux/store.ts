import { configureStore } from "@reduxjs/toolkit";
import ownerReducer from "./slices/ownerSlice";
import dogReducer from "./slices/dogSlice";
import bookingReducer from "./slices/bookingSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage for persistence
import { combineReducers } from "redux";

// ✅ Combine all reducers
const rootReducer = combineReducers({
  owner: ownerReducer,
  dog: dogReducer,
  booking: bookingReducer,
});

// ✅ Persist Configuration
const persistConfig = {
  key: "root", // Root key in localStorage
  storage, // Storage method
};

// ✅ Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for persisting
    }),
});

// ✅ Persistor to persist the store
export const persistor = persistStore(store);

// ✅ Types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
