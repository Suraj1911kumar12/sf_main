import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const infoSlice = createSlice({
  name: "UserInfo",
  initialState,
  reducers: {
    fetchInfoStart(state) {
      state.loading = true;
    },
    fetchInfoSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchInfoError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchInfoStart, fetchInfoSuccess, fetchInfoError } =
  infoSlice.actions;

export default infoSlice.reducer;
