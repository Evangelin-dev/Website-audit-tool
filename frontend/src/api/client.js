import axios from 'axios';

const API_BASE_URL = 'https://audit.thebot.agency/api/audit';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const auditAPI = {
  createAudit: async (url) => {
    const response = await apiClient.post('/tasks/', { url });
    return response.data;
  },

  // These are deprecated - data is returned directly from createAudit
  getTaskStatus: async (taskId) => {
    const response = await apiClient.post('/tasks/', { url: taskId });
    return response.data;
  },

  getResult: async (taskId) => {
    const response = await apiClient.post('/tasks/', { url: taskId });
    return response.data;
  },

  listTasks: async () => {
    return { results: [] };
  },
};

export default apiClient;
