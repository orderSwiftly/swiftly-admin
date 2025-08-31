import axios from "axios";

export async function getComplaints() {
  const token = localStorage.getItem("token");
  const api_url = process.env.NEXT_PUBLIC_API_URL;

  const response = await axios.get(`${api_url}/api/v1/complaint/get`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status !== 200) {
    throw new Error("Failed to fetch complaints");
  }

  // 👇 Return just the array, not the whole response
  return response.data.data.complaints;
}
