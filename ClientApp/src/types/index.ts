// User type
export interface User {
  id: number;
  login: string;
  name: string;
  role: string;
}

// Room type
export interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description: string;
  isAvailable: boolean;
  amenities: string[];
}

// Booking type
export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  title: string;
  description: string;
  createdAt: string; // ISO date string
  isActive: boolean;
}