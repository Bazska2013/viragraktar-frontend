import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        token: JSON.parse(localStorage.getItem('token')) || null,
    },
    reducers: {
        login: (state, {payload: token}) => {
            state.isAuthenticated = true;
            localStorage.setItem('token', JSON.stringify(token));
        },
        logout: (state) => {
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        }
    }
});

export const {login, logout} = authSlice.actions;
export const authReducer = authSlice.reducer;
export const selectAuth = (state) => state.auth.isAuthenticated;