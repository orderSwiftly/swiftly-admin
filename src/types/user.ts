export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  status: "Active" | "Inactive" | "Removed";
  role: string;
  university?: string;
  userType: string;
}

export type UserStatus = "Active" | "Inactive" | "Removed";

export interface AddUserData {
  userType: string;
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  confirmPassword: string;
}

export interface EditUserData {
  userType: string;
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  university: string;
}
