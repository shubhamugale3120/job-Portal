import api from './api';

export const getJobs = async (params = {}) => {
  const response = await api.get('/api/jobs', { params });
  return response.data; // Already contains { success, data, pagination }
};

export const getJobById = async (jobId) => {
  const response = await api.get(`/api/jobs/${jobId}`);
  return response.data; // Now contains { success, data }
};

export const getMyJobs = async () => {
  const response = await api.get('/api/jobs/my-jobs');
  return response.data; // Contains { success, data }
};

export const createJob = async (payload) => {
  const response = await api.post('/api/jobs', payload);
  return response.data; // Now contains { success, message, data }
};

export const updateJob = async (jobId, payload) => {
  const response = await api.patch(`/api/jobs/${jobId}`, payload);
  return response.data; // Now contains { success, message, data }
};

export const deleteJob = async (jobId) => {
  const response = await api.delete(`/api/jobs/${jobId}`);
  return response.data; // Now contains { success, message }
};
