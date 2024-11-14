import {createSlice} from "@reduxjs/toolkit";

const storeSlice = createSlice({
   name: 'store',
   initialState: {
       hasStore: JSON.parse(localStorage.getItem('store')) || null,
   },
     reducers: {
          createStore: (state, {payload: store}) => {
            state.hasStore = store;
            localStorage.setItem('store', JSON.stringify(store));
          },
          deleteStore: (state) => {
            state.hasStore = null;
            localStorage.removeItem('store');
          }
     }
});

export const {createStore, deleteStore} = storeSlice.actions;
export const storeReducer = storeSlice.reducer;
export const selectStore = (state) => state.store.hasStore;