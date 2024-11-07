import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
    },
    reducers: {
        setUser: (state, {payload: user}) => {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        removeUser: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        }
    }
});

export const {setUser, removeUser} = userSlice.actions;
export const userReducer = userSlice.reducer;
export const selectCurrentUser = (state) => state.user.user;