import axios, { AxiosResponse } from "axios";

// Types
export type Transaction = {
  id: number;
  reference: string;
  amount: number;
  status: string;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  customer: {
    email: string;
  };
};

type TransactionsResponse = {
  status?: string;
  data: Transaction[];
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
    timeout: 15000, // 15 seconds timeout for potentially large transaction data
  });
};

// Get all transactions
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const apiClient = createApiClient();
    const response: AxiosResponse<TransactionsResponse> = await apiClient.get(
      '/api/v1/paystack/transactions'
    );

    // Debug log to see the actual response structure
    console.log('Transactions API Response:', response.data);

    // Handle different possible response structures
    if (response.data) {
      // Check if data is directly an array
      if (Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      // Check if response.data is the array directly
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // Check for success status with data
      if (response.data.status === 'success' && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    }

    throw new Error(response.data?.message || 'Invalid transactions data received from server');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Log the full error for debugging
      console.error('Transactions API Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to access transaction data.');
      } else if (error.response?.status === 404) {
        throw new Error('Transactions endpoint not found. Please contact support.');
      } else if (error.response && typeof error.response.status === 'number' && error.response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error occurred while fetching transactions');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unexpected error occurred while fetching transactions');
  }
}

// Get transaction by reference
export async function getTransactionByReference(reference: string): Promise<Transaction | null> {
  try {
    const transactions = await getTransactions();
    return transactions.find(tx => tx.reference === reference) || null;
  } catch (error) {
    console.error('Error fetching transaction by reference:', error);
    throw error;
  }
}

// Get transactions by status
export async function getTransactionsByStatus(status: 'success' | 'failed' | 'pending'): Promise<Transaction[]> {
  try {
    const transactions = await getTransactions();
    return transactions.filter(tx => tx.status === status);
  } catch (error) {
    console.error('Error fetching transactions by status:', error);
    throw error;
  }
}