import axios from "axios";

export async function getComplaints() {
  const response = await axios.get('/api/complaints');
  if (response.status !== 200) {
    throw new Error('Failed to fetch complaints');
  }
  return response.data;
}