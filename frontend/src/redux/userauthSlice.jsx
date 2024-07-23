
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  useraccessToken: null,
  userrefreshToken: null,
  userisAuthenticated: false,
};

const authSlice = createSlice({
  name: 'userauth',
  initialState,
  reducers: {
    setTokens: (state, action) => {
        console.log("ookuser");
      state.useraccessToken = action.payload.useraccessToken;
      state.userrefreshToken = action.payload.userrefreshToken;
      state.userisAuthenticated = true;
    },
    clearTokens: (state) => {
        console.log('token clear user');
      state.useraccessToken = null;
      state.userrefreshToken = null;
      state.userisAuthenticated = false;
    },
    
  },
});

export const { setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;