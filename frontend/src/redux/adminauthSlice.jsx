
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  adminaccessToken: null,
  adminrefreshToken: null,
  adminisAuthenticated: false,
};

const authSlice = createSlice({
  name: 'adminauth',
  initialState,
  reducers: {
    setTokens: (state, action) => {
        console.log("ook");
      state.adminaccessToken = action.payload.adminaccessToken;
      state.adminrefreshToken = action.payload.adminrefreshToken;
      state.adminisAuthenticated = true;
    },
    clearTokens: (state) => {
        console.log('token clear');
      state.adminaccessToken = null;
      state.adminrefreshToken = null;
      state.adminisAuthenticated = false;
    },
    
  },
});

export const { setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;