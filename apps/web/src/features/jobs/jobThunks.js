// ../apps/web/src/features/jobs/jobThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  const response = await axios.get(`${API_BASE_URL}/api/jobs`);
  return { data: response.data.data, totalCount: response.data.total };
});

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id) => {
  await axios.delete(`${API_BASE_URL}/api/jobs/${id}`);
  return id;
});
