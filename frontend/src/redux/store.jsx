// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import adminauthReducer from './adminauthSlice';
import userauthReducer from './userauthSlice'
import  categoryReducer from './categorySlice'
import stateReduces from './statesSlice'

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  adminauth: adminauthReducer,
  userauth:userauthReducer,
  category: categoryReducer,
  state:stateReduces
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
