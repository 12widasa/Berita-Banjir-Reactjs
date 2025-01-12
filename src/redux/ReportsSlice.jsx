import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reports: [],
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    setReports: (state, action) => {
      state.reports = action.payload;
      state.loading = false;
      state.error = null;
    },
    addReport: (state, action) => {
      state.reports.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateReport: (state, action) => {
      const index = state.reports.findIndex(
        (report) => report.id === action.payload.id
      );
      if (index !== -1) {
        state.reports[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteReport: (state, action) => {
      state.reports = state.reports.filter(
        (report) => report.id !== action.payload
      );
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setReports,
  addReport,
  updateReport,
  deleteReport,
} = reportsSlice.actions;

export default reportsSlice.reducer;
