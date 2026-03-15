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
  isVerifiedStudent?: boolean; // not returned by all endpoints — optional
  createdAt: string;
  updatedAt: string;
}

interface GetUsersResponse {
  status: string;
  data: {
    users: User[];
  };
}

interface GetUserByIdResponse {
  status: string;
  data: {
    user: User;
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

export async function getUsers(): Promise<User[]> {
  try {
    const res = await axios.get<GetUsersResponse>(
      `${apiUrl}/api/v1/super-admin/get-users`,
      { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    );
    return res.data.data.users;
  } catch (err) {
    handleAxiosError(err, "Failed to fetch users");
  }
}

export async function getUserById(id: string): Promise<User> {
  try {
    const res = await axios.get<GetUserByIdResponse>(
      `${apiUrl}/api/v1/super-admin/${id}`,
      { headers: { Authorization: `Bearer ${getAuthToken()}` } }
    );
    return res.data.data.user;
  } catch (err) {
    handleAxiosError(err, "Failed to fetch user");
  }
}

export function userId(user: User): string {
  return user._id;
}