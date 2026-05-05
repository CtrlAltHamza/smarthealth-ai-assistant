import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({ name: "SLICE_NAME", initialState: { items: [], loading: false, error: null as string | null }, reducers: {} });
export default slice.reducer;
