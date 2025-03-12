import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Owner {
  ownerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

interface OwnerState {
  owner: Owner | null; // ✅ Single owner state
  owners: Owner[]; // ✅ List of owners
}

const initialState: OwnerState = {
  owner: null, // ✅ Default single owner to null
  owners: [], // ✅ Default owners array to empty
};

export const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    // ✅ Set a single owner and ensure `_id` is mapped to `ownerId`
    setOwner: (state, action: PayloadAction<{ _id: string } & Omit<Owner, "ownerId">>) => {
      state.owner = {
        ownerId: action.payload._id, // ✅ Store `_id` as `ownerId`
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        phoneNumber: action.payload.phoneNumber,
        address: action.payload.address,
      };
    },

    // ✅ Set multiple owners from an object that contains an array of owners
    setOwners: (
      state,
      action: PayloadAction<{ owners: Array<{ _id: string } & Omit<Owner, "ownerId">> }>
    ) => {
      // ✅ Ensure the payload has the `owners` array before mapping
      if (action.payload?.owners && Array.isArray(action.payload.owners)) {
        state.owners = action.payload.owners.map(owner => ({
          ownerId: owner._id, // ✅ Store `_id` as `ownerId`
          firstName: owner.firstName,
          lastName: owner.lastName,
          email: owner.email,
          phoneNumber: owner.phoneNumber,
          address: owner.address,
        }));
      } else {
        console.error("setOwners received invalid payload:", action.payload);
        state.owners = []; // ✅ Reset to empty array if data is invalid
      }
    },

    // ✅ Clear a single owner
    clearOwner: (state) => {
      state.owner = null;
    },

    // ✅ Clear all owners
    clearOwners: (state) => {
      state.owners = [];
    },
  },
});

export const { setOwner, setOwners, clearOwner, clearOwners } = ownerSlice.actions;
export default ownerSlice.reducer;
