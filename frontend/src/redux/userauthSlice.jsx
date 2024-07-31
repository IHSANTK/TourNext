
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  useraccessToken: null,
  userrefreshToken: null,
  user :{},
  userisAuthenticated: false,

};

const authSlice = createSlice({
  name: 'userauth',
  initialState,
  reducers: {
    setTokens: (state, action) => {
        console.log("ookuser sssssssssdsssssss",action.payload.user);
      state.useraccessToken = action.payload.useraccessToken;
      state.userrefreshToken = action.payload.userrefreshToken;
      state.user = action.payload.user;
      state.userisAuthenticated = true;
    },
    clearTokens: (state) => {
        console.log('token clear user');
      state.useraccessToken = null;
      state.userrefreshToken = null;
      state.userisAuthenticated = false;
      state.user = {}
    },
    
  },
});

export const { setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;