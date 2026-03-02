export interface University {
  id: string;
  name: string;
  email: string;
  status: "Enabled" | "Disabled";
  location: string;
  deliveryZone?: string;
  hours?: number;
  fees?: number;
  image?: string;
}

export type UniversityStatus = "Enabled" | "Disabled";

export interface AddUniversityData {
  name: string;
  email: string;
  state: string;
  image?: File | null;
}

export interface EditUniversityData {
  deliveryZone: string;
  university: string;
  email: string;
  hours: number;
  fees: number;
}
