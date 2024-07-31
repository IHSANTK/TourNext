
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
       
      state.useraccessToken = action.payload.useraccessToken;
      state.userrefreshToken = action.payload.userrefreshToken;
      state.userisAuthenticated = true;
    },
    setuser:(state,action)=>{
      console.log("ookuser saprate",action.payload.user);
      state.user = action.payload.user;

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

export const { setTokens, clearTokens,setuser } = authSlice.actions;

export default authSlice.reducer;