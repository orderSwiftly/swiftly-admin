import axios, { AxiosResponse } from "axios";

// Types
export type BalanceData = {
  balance: number;
  currency?: string;
  // Add other balance-related fields as needed
};

type BalanceResponse = {
  status: string;
  data: BalanceData[];
  message?: string;
};

// Base API configuration
const createApiClient = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const api_url = process.env.NEXT_PUBLIC_API_URL;

  if (!token) {
    throw new Error('Authentication token not found. Please log in again.');
  }

  if (!api_url) {
    throw new Error('API URL is not configured');
  }

  return axios.create({
    baseURL: api_url,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
  });
};

// Get balance
export async function getBalance(): Promise<number> {
  try {
    const apiClient = createApiClient();
    const response: AxiosResponse<BalanceResponse> = await apiClient.get(
      '/api/v1/paystack/balance'
    );

    // Debug log to see the actual response structure
    console.log('Balance API Response:', response.data);

    // Handle different possible response structures
    if (response.data) {
      // Check for success status and data array
      if (response.data.status === 'success' && response.data.data?.[0]?.balance !== undefined) {
        return response.data.data[0].balance;
      }
      
      // Check if balance is directly in data
      if (response.data.data && typeof response.data.data === 'number') {
        return response.data.data;
      }
      
      // Check if balance is present in the first element of the data array (fallback)
      if (
        Array.isArray(response.data.data) &&
        response.data.data[0] &&
        typeof response.data.data[0].balance === 'number'
      ) {
        return response.data.data[0].balance;
      }
      
      // If we have data but no balance found
      if (response.data.data && Array.isArray(response.data.data) && response.data.data.length === 0) {
        return 0; // No balance data available
      }
    }

    throw new Error(response.data?.message || 'Invalid balance data received from server');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Log the full error for debugging
      console.error('Axios Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to access balance information.');
      } else if (error.response?.status === 404) {
        throw new Error('Balance endpoint not found. Please contact support.');
      } else if ((error.response?.status ?? 0) >= 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error occurred while fetching balance');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unexpected error occurred while fetching balance');
  }
}