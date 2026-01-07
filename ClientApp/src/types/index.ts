export interface User {
  id: number;
  login: string;
  name: string;
  role: string;
}

export interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description: string;
  isAvailable: boolean;
  amenities: string[];
}

export interface Booking {
  id: number;
  roomId: number;
  userId: number;
  startDate: string;
  endDate: string;
  title: string;
  description: string;
  createdAt: string;
  isActive: boolean;
}
