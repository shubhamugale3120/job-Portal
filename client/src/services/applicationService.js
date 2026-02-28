import api from './api';

export const applyToJob = async (jobId, payload) => {
	const response = await api.post(`/api/applications/${jobId}/apply`, payload);
	return response.data; // Contains { success, message, data }
};

export const checkApplicationStatus = async (jobId) => {
	const response = await api.get(`/api/applications/${jobId}/check`);
	return response.data; // Contains { success, hasApplied, status?, appliedAt? }
};

export const getAppliedJobs = async () => {
	const response = await api.get('/api/applications/applied/list');
	return response.data; // Contains { success, data }
};

export const getMyApplications = async () => {
	const response = await api.get('/api/applications/me');
	return response.data; // Now contains { success, data }
};

export const getApplicationsForJob = async (jobId) => {
	const response = await api.get(`/api/applications/job/${jobId}`);
	return response.data; // Now contains { success, data }
};

export const updateApplicationStatus = async (applicationId, status) => {
	const response = await api.patch(`/api/applications/${applicationId}/status`, { status });
	return response.data; // Now contains { success, message, data }
};
