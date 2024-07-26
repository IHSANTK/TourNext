import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: []
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    addcategories: (state, action) => {
      console.log('add catgof',action.payload);
      state.categories = action.payload;
    },
    updateCategory: (state, action) => {
      const updatedCategory = action.payload;
      state.categories = state.categories.map(category =>
        category._id === updatedCategory._id ? updatedCategory : category
      );
    },
    deleteCategory: (state, action) => {
      const categoryIdToDelete = action.payload;
      console.log("slice",categoryIdToDelete);
      state.categories = state.categories.filter(category =>
        category._id !== categoryIdToDelete
      );
    }
  },
});

export const {addcategories, updateCategory,deleteCategory } = categorySlice.actions;

export default categorySlice.reducer;
