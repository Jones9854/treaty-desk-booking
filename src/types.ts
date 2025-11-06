export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  date: string;
  deskNumber: number;
}

export interface Activity {
  id: string;
  type: 'lunch' | 'after-work';
  title: string;
  description: string;
  date: string;
  time: string;
  createdBy: string;
  createdByName: string;
  participants: string[];
  maxParticipants?: number;
}

export interface Comment {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

