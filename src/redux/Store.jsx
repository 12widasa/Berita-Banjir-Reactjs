// src/redux/store.jsx
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use sessionStorage for session persistence
import authReducer from "./AuthSlice";
import reportsReducer from "./ReportsSlice";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root", // Key in storage
  storage, // Default to localStorage
};

const rootReducer = combineReducers({
  auth: authReducer,
  reports: reportsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability checks for persist
    }),
});

export const persistor = persistStore(store);
export default store;
