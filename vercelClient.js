// vercelClient.js
import axios from 'axios';

const vercelToken = process.env.VERCEL_API_TOKEN;
const vercelProjectId = process.env.VERCEL_PROJECT_ID;

const vercelClient = axios.create({
  baseURL: 'https://api.vercel.com/v9',
  headers: {
    Authorization: `Bearer ${vercelToken}`,
    'Content-Type': 'application/json'
  }
});

export const addVercelDomain = async (domain) => {
  try {
    const response = await vercelClient.post(`/projects/${vercelProjectId}/domains`, {
      name: domain
    });
    return response.data;
  } catch (error) {
    console.error('Error adding domain to Vercel:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || 'Failed to add domain');
  }
};
