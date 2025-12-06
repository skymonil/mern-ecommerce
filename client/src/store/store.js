import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index.js";
import adminProductsSlice from "./admin/products-slice/index.js";
export const store = configureStore({
    reducer: {
        // Add your slices here
        auth: authReducer,
        adminProducts: adminProductsSlice,
    }
});
