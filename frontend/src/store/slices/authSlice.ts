import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

interface User { id: string; name: string; email: string; role: string; avatar?: string; }
interface AuthState { user: User | null; accessToken: string | null; loading: boolean; error: string | null; }

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("sh_user") || "null"),
  accessToken: localStorage.getItem("sh_token"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk("auth/login", async (credentials: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", credentials);
    return data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const register = createAsyncThunk("auth/register", async (payload: any, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("sh_token");
      localStorage.removeItem("sh_user");
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: (builder) => {
    const handleFulfilled = (state: AuthState, action: any) => {
      state.loading = false;
      state.error = null;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("sh_token", action.payload.accessToken);
      localStorage.setItem("sh_user", JSON.stringify(action.payload.user));
    };
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, handleFulfilled)
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, handleFulfilled)
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
