import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BASE = `${API_URL}/api/v1/super-admin/finance`;

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DateRangeParams {
    from?: string; // YYYY-MM-DD
    to?: string;   // YYYY-MM-DD
}

export interface OrdersParams extends DateRangeParams {
    paymentStatus?: "paid" | "cancelled" | "pending";
    payoutStatus?: "unpaid" | "processing" | "paid";
    page?: number;
    limit?: number;
}

export interface RiderPayoutsParams extends DateRangeParams {
    status?: "processing" | "paid" | "failed";
    batch_id?: number;
    rider_id?: string;
    page?: number;
    limit?: number;
}

export interface PaymentTransactionsParams extends DateRangeParams {
    status?: "paid" | "cancelled" | "pending";
    page?: number;
    limit?: number;
}

export interface TransferTransactionsParams extends DateRangeParams {
    status?: "processing" | "paid" | "failed";
    batch_id?: number;
    rider_id?: string;
    page?: number;
    limit?: number;
}

// ─── 1. Dashboard ─────────────────────────────────────────────────────────────

export const getDashboard = async (params?: DateRangeParams) => {
    try {
        const response = await axios.get(`${BASE}/dashboard`, {
            params,
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw (error as AxiosError)?.response?.data ?? error;
    }
};

// ─── 2. Orders ────────────────────────────────────────────────────────────────

export const getOrders = async (params?: OrdersParams) => {
    try {
        const response = await axios.get(`${BASE}/orders`, {
            params,
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw (error as AxiosError)?.response?.data ?? error;
    }
};

export const getOrderById = async (id: string) => {
    try {
        const response = await axios.get(`${BASE}/orders`, {
            params: { id },
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw (error as AxiosError)?.response?.data ?? error;
    }
};

// ─── 3. Rider Payouts ─────────────────────────────────────────────────────────

export const getRiderPayouts = async (params?: RiderPayoutsParams) => {
    try {
        const response = await axios.get(`${BASE}/rider-payouts`, {
            params,
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw (error as AxiosError)?.response?.data ?? error;
    }
};

export const getRiderPayoutById = async (id: string) => {
    try {
        const response = await axios.get(`${BASE}/rider-payouts`, {
            params: { id },
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw (error as AxiosError)?.response?.data ?? error;
    }
};

// ─── 4. Customer Payment Transactions ─────────────────────────────────────────

export const getPaymentTransactions = async (params?: PaymentTransactionsParams) => {
    try {
        const response = await axios.get(`${BASE}/transactions/payments`, {
            params,
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw (error as AxiosError)?.response?.data ?? error;
    }
};

export const getPaymentTransactionById = async (id: string) => {
    try {
        const response = await axios.get(`${BASE}/transactions/payments`, {
            params: { id },
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw (error as AxiosError)?.response?.data ?? error;
    }
};

// ─── 5. Rider Transfer Transactions ───────────────────────────────────────────

export const getTransferTransactions = async (params?: TransferTransactionsParams) => {
    try {
        const response = await axios.get(`${BASE}/transactions/transfers`, {
            params,
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw (error as AxiosError)?.response?.data ?? error;
    }
};

export const getTransferTransactionById = async (id: string) => {
    try {
        const response = await axios.get(`${BASE}/transactions/transfers`, {
            params: { id },
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw (error as AxiosError)?.response?.data ?? error;
    }
};