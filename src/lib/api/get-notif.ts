import axios, { AxiosResponse } from "axios";

// Types
export type Notification = {
  _id: string;
  adminId: string;
  message: string;
  resourceType: string;
  relatedResourceId: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationsResponse = {
  status: string;
  data: {
    notifications: Notification[];
  };
  message?: string;
};

type ApiResponse = {
  status: 'success' | 'error';
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

// Get all notifications
export async function getNotifications(): Promise<Notification[]> {
  try {
    const apiClient = createApiClient();
    const response: AxiosResponse<NotificationsResponse> = await apiClient.get(
      '/api/v1/notification/super-admin/get-notifications'
    );

    if (response.data.status === 'success' && response.data.data?.notifications) {
      return response.data.data.notifications;
    } else {
      throw new Error(response.data.message || 'Failed to fetch notifications');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to access notifications.');
      } else if ((error.response?.status ?? 0) >= 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection.');
      }
      throw new Error(error.response?.data?.message || 'Network error occurred');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unexpected error occurred while fetching notifications');
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const apiClient = createApiClient();
    const response: AxiosResponse<ApiResponse> = await apiClient.patch(
      `/api/v1/notification/super-admin/notifications/${notificationId}/read`
    );

    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'Failed to mark notification as read');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please log in again.');
      } else if (error.response?.status === 404) {
        throw new Error('Notification not found.');
      } else if ((error.response?.status ?? 0) >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw new Error(error.response?.data?.message || 'Network error occurred');
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unexpected error occurred while updating notification');
  }
}