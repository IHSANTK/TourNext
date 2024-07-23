import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  states: []
};

const stateSlice = createSlice({
  name: 'states',
  initialState,
  reducers: {
    addStates: (state, action) => {
      console.log("Updating states in Redux", action.payload);
      state.states = action.payload;
    },
    deleteState:(state,action)=>{
      
        const stateIdToDelete = action.payload;
        console.log(stateIdToDelete);

      state.states = state.states.filter(state =>
        state._id !== stateIdToDelete
      );  
    }
  },
});

export const { addStates,deleteState } = stateSlice.actions;

export default stateSlice.reducer;