import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    isAuthenticated: false,
    user: null,
    isLoading: true,
}

// Thunk for User Registration
export const RegisterUser = createAsyncThunk("auth/register", 
    async(FormData, {rejectWithValue}) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', FormData, {
                withCredentials: true,
            })
            return response.data;
        } catch (err) {
           const msg =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";
      return rejectWithValue(msg);
        }
    }
)

// Thunk for User Login
// FIX: Corrected the action type string from "/auth/register" to "auth/login"
export const LoginUser = createAsyncThunk("auth/login", 
    async(FormData, {rejectWithValue}) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', FormData, {
                withCredentials: true,
            })
            return response.data;
        } catch (err) {
           const msg =
        err?.response?.data?.message ||
        "Login failed. Please try again.";
      return rejectWithValue(msg);
        }
    }
)
   
export const checkAuth = createAsyncThunk("auth/check-auth", 
    async(_, {rejectWithValue}) => { // Using '_' for unused first argument
        try {
            const response = await axios.get('http://localhost:5000/api/auth/check-auth', {
                withCredentials: true,
                headers: {
                    // Combined cache control directives into a single valid string
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache', // Common header for cache prevention
                    'Expires': '0', // Common header for cache prevention
                },
            }); // <-- FIXED: Closing parenthesis for axios.get was missing here
            
            return response.data;
        }
        catch (err) {
            // Note: The original implementation was missing rejectWithValue import/scope.
            // Assuming it's available from the thunk function arguments.
            const msg =
                err?.response?.data?.message ||
                "Authentication check failed. User is likely logged out.";
            
            // For a check-auth thunk, returning the error message via rejectWithValue
            // is often less important than just failing the thunk to handle the state.
            // If the call fails (e.g., 401 Unauthorized), we usually just let the
            // extraReducer set isAuthenticated to false.
            return rejectWithValue(msg);
        }
    }
);


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: { 
        setUser:(state, action) => {
             // Reducer to manually set or clear user state (e.g., for logout or initialization)
             state.user = action.payload;
             state.isAuthenticated = !!action.payload; // Check if payload exists
             state.isLoading = false;
        },
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        // --- RegisterUser Cases ---
        builder
        .addCase(RegisterUser.pending, (state) => { 
            state.isLoading = true;
        })
        .addCase(RegisterUser.fulfilled, (state, action) => { 
            state.isLoading = false;
            // Note: Typically registration doesn't authenticate you instantly, 
            // but for simple apps, you might log the user in here.
            // Keeping it simple: registration success but waiting for explicit login/verification.
            state.isAuthenticated = false;
            state.user = null;
        })
        .addCase(RegisterUser.rejected,(state,action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
        })
        
        // --- LoginUser Cases ---
        .addCase(LoginUser.pending, (state) => { 
            state.isLoading = true;
            state.isAuthenticated = false;
            state.user = null;
        })
        .addCase(LoginUser.fulfilled, (state, action) => { 
            console.log(action);
            
            state.isLoading = false;
            // Assuming the payload contains the user object
            state.user = action.payload.user;; 
            state.isAuthenticated = true;
        })
        .addCase(LoginUser.rejected,(state,action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            // Optionally log the error message from the rejection:
            // console.error("Login failed:", action.payload);
        })
        .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
    }
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;