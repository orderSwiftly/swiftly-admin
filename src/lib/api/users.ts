import axios, { AxiosError } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface Address {
  _id: string;
  building: string;
  room: string;
  institutionId: string;
}

export interface User {
  _id: string;
  // buyers & riders use fullname; sellers use businessName
  fullname?: string;
  businessName?: string;
  email: string;
  role: "buyer" | "seller" | "rider" | "admin" | string;
  institutionId?: string;
  phoneNumber?: string;
  // buyers use photo; sellers use logo
  photo?: string;
  logo?: string;
  address?: Address[];
  accountNumber?: string;
  bankCode?: string;
  paystackRecipientCode?: string;
  paystackSubaccountId?: string;
  createdBy?: string;
  hasSubaccount: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GetUsersResponse {
  status: string;
  data: {
    users: User[];
  };
}

export async function getUsers(): Promise<User[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("You must be logged in to access this page");
    }

    const res = await axios.get<GetUsersResponse>(
      `${apiUrl}/api/v1/super-admin/get-users`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data.data.users;
  } catch (err) {
    if (err instanceof AxiosError) {
      const message =
        err.response?.data?.message || err.message || "Failed to fetch users";
      throw new Error(message);
    }
    throw err;
  }
}