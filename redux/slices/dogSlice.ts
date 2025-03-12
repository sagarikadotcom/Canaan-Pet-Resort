import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Dog {
  name: string;
  breed: string;
  age: number;
  sex: string;
  profilePicture?: string;
}

interface DogState {
  dogs: Dog[];
}

const initialState: DogState = { dogs: [] };

export const dogSlice = createSlice({
  name: "dog",
  initialState,
  reducers: {
    addDog: (state, action: PayloadAction<Dog>) => {
      state.dogs.push(action.payload);
    },
    setDogs: (state, action: PayloadAction<Dog[]>) => {
      state.dogs = action.payload; // Replaces existing dogs with fetched ones
    },
    clearDogs: (state) => {
      state.dogs = [];
    },
  },
});

export const { addDog, setDogs, clearDogs } = dogSlice.actions;
export default dogSlice.reducer;
