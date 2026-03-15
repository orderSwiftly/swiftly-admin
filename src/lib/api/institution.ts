import axios, { AxiosError } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface Institution {
  _id: string;
  name: string;
  logo: string;
  address: {
    city: string;
    state: string;
    country: string;
  };
  createdAt: string;
}

interface GetInstitutionsResponse {
  status: string;
  data: {
    institutions: Institution[];
  };
}

function getAuthToken(): string {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("You must be logged in to access this page");
  return token;
}

function handleAxiosError(err: unknown, fallback: string): never {
  if (err instanceof AxiosError) {
    throw new Error(err.response?.data?.message || err.message || fallback);
  }
  throw err;
}

export async function getInstitutions(): Promise<Institution[]> {
  try {
    const res = await axios.get<GetInstitutionsResponse>(
      `${apiUrl}/api/v1/institution/get`,
      { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    );
    return res.data.data.institutions;
  } catch (err) {
    handleAxiosError(err, "Failed to fetch institutions");
  }
}