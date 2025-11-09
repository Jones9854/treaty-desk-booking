# Backend Integration Guide

This guide explains how to integrate the React frontend with the .NET backend API.

## Overview

The backend provides RESTful API endpoints for:
- User management
- Desk bookings (with business rules)
- Social activities
- Comments

## Quick Start

### 1. Start the Backend

```bash
cd backend/TreatyDeskBooking.Api
dotnet run
```

Backend will run at: http://localhost:5000

### 2. Update Frontend API Calls

Replace the local state management in your React components with API calls.

## Frontend Integration Steps

### Step 1: Create API Service

Create a new file `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';

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

// Users API
export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  },
  
  getById: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return response.json();
  },
  
  create: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },
  
  update: async (id: string, user: User): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },
  
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
  },
};

// Bookings API
export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    return response.json();
  },
  
  getByUser: async (userId: string): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`);
    return response.json();
  },
  
  getByDate: async (date: string): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings/date/${date}`);
    return response.json();
  },
  
  create: async (booking: Omit<Booking, 'id' | 'deskNumber' | 'userName'>): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create booking');
    }
    
    return response.json();
  },
  
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/bookings/${id}`, { method: 'DELETE' });
  },
  
  deleteByUserAndDate: async (userId: string, date: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/bookings/user/${userId}/date/${date}`, {
      method: 'DELETE',
    });
  },
};

// Activities API
export const activityApi = {
  getAll: async (): Promise<Activity[]> => {
    const response = await fetch(`${API_BASE_URL}/activities`);
    return response.json();
  },
  
  getById: async (id: string): Promise<Activity> => {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`);
    return response.json();
  },
  
  create: async (activity: Omit<Activity, 'id'>): Promise<Activity> => {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    return response.json();
  },
  
  update: async (id: string, activity: Partial<Activity>): Promise<Activity> => {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(activity),
    });
    return response.json();
  },
  
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/activities/${id}`, { method: 'DELETE' });
  },
};

// Comments API
export const commentApi = {
  getByActivity: async (activityId: string): Promise<Comment[]> => {
    const response = await fetch(`${API_BASE_URL}/activities/${activityId}/comments`);
    return response.json();
  },
  
  create: async (comment: Omit<Comment, 'id' | 'timestamp'>): Promise<Comment> => {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment),
    });
    return response.json();
  },
  
  delete: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/comments/${id}`, { method: 'DELETE' });
  },
};
```

### Step 2: Update App.tsx to Load Data from API

```typescript
import { useEffect, useState } from 'react';
import { bookingApi } from './services/api';
import { Booking, User } from './types';

function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getAll();
      setBookings(data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingsChange = async (newBookings: Booking[]) => {
    setBookings(newBookings);
    // Reload from server to ensure consistency
    await loadBookings();
  };

  // ... rest of component
}
```

### Step 3: Update DeskBooking Component

```typescript
// In DeskBooking.tsx
import { bookingApi } from '../services/api';

const handleBookDesk = async (date: string) => {
  try {
    const newBooking = await bookingApi.create({
      userId: currentUser.id,
      date,
    });
    
    onBookingsChange([...bookings, newBooking]);
    setMessage({ type: 'success', text: `Desk ${newBooking.deskNumber} booked successfully!` });
  } catch (error: any) {
    setMessage({ type: 'error', text: error.message });
  }
  
  setTimeout(() => setMessage(null), 3000);
};

const handleCancelBooking = async (date: string) => {
  try {
    await bookingApi.deleteByUserAndDate(currentUser.id, date);
    
    const updatedBookings = bookings.filter(
      b => !(b.userId === currentUser.id && b.date === date)
    );
    onBookingsChange(updatedBookings);
    setMessage({ type: 'info', text: 'Booking cancelled successfully!' });
  } catch (error: any) {
    setMessage({ type: 'error', text: error.message });
  }
  
  setTimeout(() => setMessage(null), 3000);
};
```

## Environment Configuration

Create `.env` files for different environments:

### .env.development
```
VITE_API_URL=http://localhost:5000/api
```

### .env.production
```
VITE_API_URL=https://your-api-domain.com/api
```

Update `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

## Error Handling

Add comprehensive error handling:

```typescript
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    return error.response.data.error || 'Server error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Unable to connect to server. Please check your connection.';
  } else {
    // Other errors
    return error.message || 'An unexpected error occurred';
  }
};
```

## Testing the Integration

### 1. Start Both Services

Terminal 1:
```bash
cd backend/TreatyDeskBooking.Api
dotnet run
```

Terminal 2:
```bash
npm run dev
```

### 2. Test Flow

1. Open http://localhost:5173
2. Create a user (if not exists)
3. Book a desk - should save to MySQL
4. Refresh page - bookings should persist
5. Cancel booking - should delete from database

### 3. Verify in Database

```bash
mysql -u root -p
USE treaty_desk_booking;

SELECT * FROM Users;
SELECT * FROM Bookings;
```

## CORS Configuration

The backend is already configured for CORS. If you need to add more origins:

In `backend/TreatyDeskBooking.Api/Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://your-production-domain.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});
```

## Loading States

Add loading indicators in your components:

```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
}
```

## API Response Validation

Add runtime type checking using Zod:

```bash
npm install zod
```

```typescript
import { z } from 'zod';

const BookingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  date: z.string(),
  deskNumber: z.number(),
});

export const bookingApi = {
  getAll: async (): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    const data = await response.json();
    return z.array(BookingSchema).parse(data);
  },
};
```

## Next Steps

1. ✅ Backend API is running
2. ⬜ Create `src/services/api.ts`
3. ⬜ Update App.tsx to use API
4. ⬜ Update DeskBooking.tsx to use API
5. ⬜ Update SocialFeed.tsx to use API
6. ⬜ Add error boundaries
7. ⬜ Add loading states
8. ⬜ Test all features

## Troubleshooting

### CORS Errors
- Check backend CORS configuration includes your frontend URL
- Verify both services are running

### 404 Errors
- Confirm API endpoint URLs are correct
- Check backend is running on expected port

### Authentication Issues
- This basic implementation has no auth
- For production, add JWT authentication

## Production Deployment

1. Update API URL in environment variables
2. Build React app: `npm run build`
3. Deploy .NET API to hosting service (Azure, AWS, etc.)
4. Update CORS to include production frontend URL
5. Use environment variables for connection strings

## Resources

- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [React Query](https://tanstack.com/query/latest) - For advanced data fetching
- [Axios](https://axios-http.com/) - Alternative to fetch

