
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  useraccessToken: null,
  userrefreshToken: null,
  userid :null,
  userisAuthenticated: false,

};

const authSlice = createSlice({
  name: 'userauth',
  initialState,
  reducers: {
    setTokens: (state, action) => {
        console.log("ookuser sssssssssdsssssss",action.payload.userid);
      state.useraccessToken = action.payload.useraccessToken;
      state.userrefreshToken = action.payload.userrefreshToken;
      state.userid = action.payload.userid;
      state.userisAuthenticated = true;
    },
    clearTokens: (state) => {
        console.log('token clear user');
      state.useraccessToken = null;
      state.userrefreshToken = null;
      state.userisAuthenticated = false;
      state.userid = null
    },
    
  },
});

export const { setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;