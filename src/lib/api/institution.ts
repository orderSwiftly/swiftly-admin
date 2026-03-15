import axios, { AxiosError } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

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

export interface AddInstitutionData {
  name: string;
  city: string;
  state: string;
  country: string;
  logo: File | null;
}

export interface EditInstitutionData {
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  logo?: File | null;
}

interface GetInstitutionsResponse {
  status: string;
  data: {
    institutions: Institution[];
  };
}

interface InstitutionResponse {
  status: string;
  data: {
    institution: Institution;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Services ─────────────────────────────────────────────────────────────────

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

export async function addInstitution(data: AddInstitutionData): Promise<Institution> {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("country", data.country);
    if (data.logo) formData.append("logo", data.logo);

    const res = await axios.post<InstitutionResponse>(
      `${apiUrl}/api/v1/super-admin/add-institution`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data.data.institution;
  } catch (err) {
    handleAxiosError(err, "Failed to add institution");
  }
}

export async function editInstitution(
  id: string,
  data: EditInstitutionData
): Promise<Institution> {
  try {
    const formData = new FormData();
    if (data.name)    formData.append("name", data.name);
    if (data.city)    formData.append("city", data.city);
    if (data.state)   formData.append("state", data.state);
    if (data.country) formData.append("country", data.country);
    if (data.logo)    formData.append("logo", data.logo);

    const res = await axios.patch<InstitutionResponse>(
      `${apiUrl}/api/v1/super-admin/edit/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data.data.institution;
  } catch (err) {
    handleAxiosError(err, "Failed to update institution");
  }
}

export async function deleteInstitution(id: string): Promise<void> {
  try {
    await axios.delete(
      `${apiUrl}/api/v1/super-admin/delete/${id}`,
      { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    );
  } catch (err) {
    handleAxiosError(err, "Failed to delete institution");
  }
}