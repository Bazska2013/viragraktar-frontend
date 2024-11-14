import { configureStore } from '@reduxjs/toolkit';
import {authReducer} from "./features/auth/authSlice.js";
import {userReducer} from "./features/auth/userSlice.js";
import {storeReducer} from "./features/store/storeSlice.js";

export default configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        store: storeReducer
    },
});