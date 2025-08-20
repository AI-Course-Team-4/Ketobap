import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likes: [],
  dislikes: [],
  allergies: [],
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setPreferences(state, action) {
      const { likes, dislikes, allergies } = action.payload || {};
      state.likes = Array.isArray(likes) ? likes : [];
      state.dislikes = Array.isArray(dislikes) ? dislikes : [];
      state.allergies = Array.isArray(allergies) ? allergies : [];
    },
    clearPreferences(state) {
      state.likes = [];
      state.dislikes = [];
      state.allergies = [];
    },
  },
});

export const { setPreferences, clearPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;


