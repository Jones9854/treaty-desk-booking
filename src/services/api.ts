// API Service for Treaty Desk Booking
// Connects to .NET backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Helper function to handle API errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// ==================== USER API ====================

export const userApi = {
  /**
   * Get all users
   */
  getAll: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  },

  /**
   * Find user by email
   */
  findByEmail: async (email: string): Promise<User | null> => {
    try {
      const users = await userApi.getAll();
      return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    } catch (error) {
      console.error('Failed to find user by email:', error);
      return null;
    }
  },

  /**
   * Find or create user by name and email
   */
  findOrCreate: async (name: string, email: string): Promise<User> => {
    try {
      // First, try to find existing user by email
      const existingUser = await userApi.findByEmail(email);
      if (existingUser) {
        return existingUser;
      }

      // If not found, create new user
      const newUser: Omit<User, 'id'> = {
        name,
        email,
        avatar: undefined,
      };

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to find or create user:', error);
      throw error;
    }
  },

  /**
   * Create a new user
   */
  create: async (user: Omit<User, 'id'>): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  /**
   * Update user
   */
  update: async (id: string, user: User): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  /**
   * Delete user
   */
  delete: async (id: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },
};

// ==================== BOOKING API ====================

export const bookingApi = {
  /**
   * Get all bookings
   */
  getAll: async (): Promise<Booking[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      throw error;
    }
  },

  /**
   * Get bookings by user ID
   */
  getByUser: async (userId: string): Promise<Booking[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch user bookings:', error);
      throw error;
    }
  },

  /**
   * Get bookings by date
   */
  getByDate: async (date: string): Promise<Booking[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/date/${date}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch date bookings:', error);
      throw error;
    }
  },

  /**
   * Create a new booking
   */
  create: async (booking: Omit<Booking, 'id' | 'deskNumber' | 'userName'>): Promise<Booking> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to create booking' }));
        throw new Error(error.error || 'Failed to create booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create booking:', error);
      throw error;
    }
  },

  /**
   * Delete booking by ID
   */
  delete: async (id: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/bookings/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete booking:', error);
      throw error;
    }
  },

  /**
   * Delete booking by user and date
   */
  deleteByUserAndDate: async (userId: string, date: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/bookings/user/${userId}/date/${date}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete booking:', error);
      throw error;
    }
  },
};

// ==================== ACTIVITY API ====================

export const activityApi = {
  /**
   * Get all activities
   */
  getAll: async (): Promise<Activity[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      throw error;
    }
  },

  /**
   * Get activity by ID
   */
  getById: async (id: string): Promise<Activity> => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      throw error;
    }
  },

  /**
   * Create a new activity
   */
  create: async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to create activity:', error);
      throw error;
    }
  },

  /**
   * Update activity
   */
  update: async (id: string, activity: Partial<Activity>): Promise<Activity> => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to update activity:', error);
      throw error;
    }
  },

  /**
   * Delete activity
   */
  delete: async (id: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/activities/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete activity:', error);
      throw error;
    }
  },
};

// ==================== COMMENT API ====================

export const commentApi = {
  /**
   * Get comments for an activity
   */
  getByActivity: async (activityId: string): Promise<Comment[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/activities/${activityId}/comments`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      throw error;
    }
  },

  /**
   * Create a new comment
   */
  create: async (comment: Omit<Comment, 'id' | 'timestamp'>): Promise<Comment> => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comment),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw error;
    }
  },

  /**
   * Delete comment
   */
  delete: async (id: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/comments/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  },
};

// ==================== UTILITY ====================

/**
 * Check if the API is reachable
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Get the API base URL
 */
export const getApiBaseUrl = (): string => {
  return API_BASE_URL;
};

