# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│                     React + TypeScript + Vite                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ DeskBooking  │  │ SocialFeed   │  │ LoginScreen  │        │
│  │  Component   │  │  Component   │  │  Component   │        │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘        │
│         │                  │                  │                 │
│         └──────────────────┴──────────────────┘                │
│                            │                                    │
│                   ┌────────▼────────┐                          │
│                   │  API Service    │                          │
│                   │   (api.ts)      │                          │
│                   └────────┬────────┘                          │
└────────────────────────────┼─────────────────────────────────┘
                             │
                             │ HTTP/REST (JSON)
                             │ CORS Enabled
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                         BACKEND LAYER                         │
│                    .NET 8 Minimal API                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Program.cs (API Endpoints)              │    │
│  │                                                      │    │
│  │  • GET/POST/PUT/DELETE /api/users                   │    │
│  │  • GET/POST/DELETE /api/bookings                    │    │
│  │  • GET/POST/PUT/DELETE /api/activities              │    │
│  │  • GET/POST/DELETE /api/comments                    │    │
│  └────────────────────┬─────────────────────────────────┘    │
│                       │                                       │
│                       │                                       │
│  ┌────────────────────▼─────────────────────────────────┐    │
│  │        ApplicationDbContext (EF Core)                │    │
│  │                                                      │    │
│  │  • DbSet<User>                                      │    │
│  │  • DbSet<Booking>                                   │    │
│  │  • DbSet<Activity>                                  │    │
│  │  • DbSet<Comment>                                   │    │
│  │  • Relationships & Validations                      │    │
│  └────────────────────┬─────────────────────────────────┘    │
└────────────────────────┼──────────────────────────────────────┘
                         │
                         │ MySQL Connection
                         │ (Pomelo Provider)
                         │
┌────────────────────────▼─────────────────────────────────────┐
│                      DATABASE LAYER                          │
│                         MySQL 8.0                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │ Bookings │  │Activities│  │ Comments │   │
│  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤   │
│  │ Id (PK)  │  │ Id (PK)  │  │ Id (PK)  │  │ Id (PK)  │   │
│  │ Name     │  │ UserId◄──┼──┤ Type     │  │ ActId◄───┼──┐│
│  │ Email    │  │ UserName │  │ Title    │  │ UserId   │  ││
│  │ Avatar   │  │ Date     │  │ Date     │  │ UserName │  ││
│  └────┬─────┘  │ DeskNum  │  │ Time     │  │ Text     │  ││
│       │        └──────────┘  │ Creator  │  │Timestamp │  ││
│       │                      │ Particip.│  └──────────┘  ││
│       │                      └──────────┘                 ││
│       │                           │                       ││
│       └───────────────────────────┴───────────────────────┘│
│                    (Foreign Keys & Indexes)                 │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Booking a Desk

```
User Action (Frontend)
      │
      ▼
DeskBooking Component
      │
      ├─ Validate locally
      │   • Check if already booked
      │   • Check weekly limit (2 days)
      │   • Check desk availability
      │
      ▼
bookingApi.create()
      │
      ▼
POST /api/bookings (Backend)
      │
      ├─ Server-side validation
      │   • Verify user exists
      │   • Check duplicate booking
      │   • Check weekly limit
      │   • Check max 15 desks
      │   • Assign desk number
      │
      ▼
Entity Framework Core
      │
      ▼
INSERT INTO Bookings (MySQL)
      │
      ▼
Return created booking
      │
      ▼
Update UI with confirmation
```

### Creating Social Activity

```
User Action (Frontend)
      │
      ▼
SocialFeed Component
      │
      ▼
activityApi.create()
      │
      ▼
POST /api/activities (Backend)
      │
      ├─ Serialize participants array
      │   (string[] → JSON string)
      │
      ▼
Entity Framework Core
      │
      ▼
INSERT INTO Activities (MySQL)
      │
      ▼
Return created activity
      │
      ├─ Deserialize participants
      │   (JSON string → string[])
      │
      ▼
Update UI with new activity
```

## Technology Stack Details

### Frontend Stack

```
React 18.2.0
├── TypeScript 5.2.2
├── Vite 5.0.8
│   ├── Fast HMR
│   └── Optimized builds
├── TailwindCSS 3.3.6
│   ├── Utility-first CSS
│   └── Custom color palette
├── Lucide React 0.294.0
│   └── Modern icon library
└── React Hooks
    ├── useState
    ├── useEffect
    └── Custom hooks (future)
```

### Backend Stack

```
.NET 8.0
├── ASP.NET Core Minimal API
│   ├── Lightweight
│   ├── Fast startup
│   └── Modern C# features
├── Entity Framework Core 8.0
│   ├── Code-first approach
│   ├── Migrations
│   └── LINQ queries
├── Pomelo.EntityFrameworkCore.MySql 8.0
│   └── MySQL provider
├── Swashbuckle.AspNetCore 6.5.0
│   └── Swagger/OpenAPI docs
└── Built-in features
    ├── CORS
    ├── JSON serialization
    └── Dependency injection
```

### Database Stack

```
MySQL 8.0
├── InnoDB engine
├── UTF-8 support
├── Foreign keys
├── Indexes
└── Transactions
```

## API Endpoints Map

```
/api
├── /users
│   ├── GET     /              # List all users
│   ├── GET     /{id}          # Get user by ID
│   ├── POST    /              # Create user
│   ├── PUT     /{id}          # Update user
│   └── DELETE  /{id}          # Delete user
│
├── /bookings
│   ├── GET     /              # List all bookings
│   ├── GET     /{id}          # Get booking by ID
│   ├── GET     /user/{userId} # Get user's bookings
│   ├── GET     /date/{date}   # Get date's bookings
│   ├── POST    /              # Create booking ⚡ (with validations)
│   ├── DELETE  /{id}          # Delete booking
│   └── DELETE  /user/{userId}/date/{date} # Delete specific
│
├── /activities
│   ├── GET     /              # List all activities
│   ├── GET     /{id}          # Get activity by ID
│   ├── POST    /              # Create activity
│   ├── PUT     /{id}          # Update activity
│   └── DELETE  /{id}          # Delete activity
│
└── /comments
    ├── GET     /activities/{activityId}/comments # List comments
    ├── POST    /              # Create comment
    └── DELETE  /{id}          # Delete comment
```

## Database Schema Detail

```sql
-- Users Table
CREATE TABLE Users (
    Id VARCHAR(255) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Avatar VARCHAR(500),
    INDEX idx_email (Email)
);

-- Bookings Table
CREATE TABLE Bookings (
    Id VARCHAR(255) PRIMARY KEY,
    UserId VARCHAR(255) NOT NULL,
    UserName VARCHAR(100) NOT NULL,
    Date VARCHAR(10) NOT NULL,
    DeskNumber INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    INDEX idx_user_date (UserId, Date),
    INDEX idx_date (Date)
);

-- Activities Table
CREATE TABLE Activities (
    Id VARCHAR(255) PRIMARY KEY,
    Type VARCHAR(20) NOT NULL,        -- 'lunch' | 'after-work'
    Title VARCHAR(200) NOT NULL,
    Description VARCHAR(1000),
    Date VARCHAR(10) NOT NULL,
    Time VARCHAR(10) NOT NULL,
    CreatedBy VARCHAR(255) NOT NULL,
    CreatedByName VARCHAR(100) NOT NULL,
    Participants VARCHAR(2000),       -- JSON array as string
    MaxParticipants INT,
    INDEX idx_date (Date),
    INDEX idx_type (Type)
);

-- Comments Table
CREATE TABLE Comments (
    Id VARCHAR(255) PRIMARY KEY,
    ActivityId VARCHAR(255) NOT NULL,
    UserId VARCHAR(255) NOT NULL,
    UserName VARCHAR(100) NOT NULL,
    Text VARCHAR(1000) NOT NULL,
    Timestamp VARCHAR(255) NOT NULL,
    FOREIGN KEY (ActivityId) REFERENCES Activities(Id) ON DELETE CASCADE,
    INDEX idx_activity (ActivityId)
);
```

## Business Rules Implementation

### Desk Booking Rules

| Rule | Implementation Location | Validation |
|------|------------------------|------------|
| Max 15 desks/day | Backend + Frontend | `dateBookings >= 15` |
| Max 2 days/week | Backend + Frontend | `weeklyCount >= 2` |
| No duplicate booking | Backend + Frontend | Check userId + date |
| Valid user required | Backend only | User FK constraint |
| Auto desk numbering | Backend only | `count + 1` |

### Data Validation

| Field | Frontend | Backend | Database |
|-------|----------|---------|----------|
| User email format | ✅ HTML5 | ❌ None | UNIQUE |
| User name required | ✅ React | ❌ None | NOT NULL |
| Booking date format | ✅ JS Date | ❌ None | VARCHAR(10) |
| Activity type | ✅ TypeScript | ❌ None | VARCHAR(20) |

## Security Considerations

### Current Implementation

✅ **Implemented:**
- CORS configuration
- SQL injection protection (EF Core)
- Input validation
- Foreign key constraints
- Unique email constraint

⚠️ **Not Implemented (for production):**
- Authentication/Authorization
- Rate limiting
- Request validation middleware
- API versioning
- Logging & monitoring
- HTTPS enforcement

### Production Recommendations

```
Authentication Layer (JWT)
      │
      ▼
Rate Limiting Middleware
      │
      ▼
Request Validation
      │
      ▼
CORS
      │
      ▼
API Endpoints
      │
      ▼
Authorization Checks
      │
      ▼
Database
```

## Performance Considerations

### Frontend Optimizations
- ✅ Vite for fast HMR
- ✅ TailwindCSS purging
- ✅ Lazy loading (can be improved)
- ⬜ React.memo for components
- ⬜ Virtual scrolling for large lists

### Backend Optimizations
- ✅ Minimal API (lightweight)
- ✅ Database indexes
- ✅ Eager loading with includes
- ⬜ Response caching
- ⬜ Connection pooling (configured by default)

### Database Optimizations
- ✅ Primary keys on all tables
- ✅ Foreign key indexes
- ✅ Composite indexes (UserId, Date)
- ⬜ Query optimization
- ⬜ Partitioning for large datasets

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│              CDN / Static Host              │
│         (GitHub Pages, Vercel, etc.)        │
│                                             │
│  • React Build (static files)               │
│  • index.html, CSS, JS                      │
└──────────────────┬──────────────────────────┘
                   │
                   │ API Calls
                   │
┌──────────────────▼──────────────────────────┐
│            Application Server               │
│      (Azure, AWS, DigitalOcean, etc.)       │
│                                             │
│  • .NET 8 Runtime                           │
│  • TreatyDeskBooking.Api                    │
│  • Environment: Production                  │
│  • HTTPS enforced                           │
└──────────────────┬──────────────────────────┘
                   │
                   │ MySQL Connection
                   │
┌──────────────────▼──────────────────────────┐
│            Database Server                  │
│       (Azure MySQL, AWS RDS, etc.)          │
│                                             │
│  • MySQL 8.0                                │
│  • Automated backups                        │
│  • SSL connections                          │
│  • Monitoring enabled                       │
└─────────────────────────────────────────────┘
```

## Folder Structure

```
treaty-desk-booking/
├── backend/                      # Backend API
│   ├── TreatyDeskBooking.Api/
│   │   ├── Models/              # Entity models
│   │   ├── Data/                # DbContext
│   │   ├── Program.cs           # API endpoints
│   │   └── *.csproj             # Project file
│   ├── README.md                # Backend docs
│   ├── QUICKSTART.md            # Quick reference
│   ├── MIGRATION_GUIDE.md       # Migration help
│   ├── setup.sh                 # Auto setup (Unix)
│   ├── setup.ps1                # Auto setup (Windows)
│   └── docker-compose.yml       # MySQL Docker
│
├── src/                         # Frontend source
│   ├── components/              # React components
│   │   ├── DeskBooking.tsx
│   │   ├── SocialFeed.tsx
│   │   └── LoginScreen.tsx
│   ├── services/                # API services (to be created)
│   │   └── api.ts
│   ├── types.ts                 # TypeScript types
│   ├── App.tsx                  # Main app
│   └── main.tsx                 # Entry point
│
├── BACKEND_INTEGRATION.md        # Integration guide
├── BACKEND_SUMMARY.md            # What was built
├── GETTING_STARTED.md            # Setup guide
├── ARCHITECTURE.md               # This file
└── README.md                     # Main docs
```

## Component Interaction

```
App.tsx
├── Navigation
├── LoginScreen (conditional)
└── DeskBooking / SocialFeed (conditional)
    │
    ├── Local State Management
    │   ├── useState hooks
    │   └── useEffect hooks
    │
    └── API Integration (when connected to backend)
        ├── GET requests (load data)
        ├── POST requests (create)
        ├── PUT requests (update)
        └── DELETE requests (remove)
```

## Future Enhancements

### Phase 1: Core Features
- ✅ Desk booking system
- ✅ Social activities
- ✅ Backend API
- ✅ MySQL database

### Phase 2: User Experience
- ⬜ User authentication
- ⬜ Profile management
- ⬜ Email notifications
- ⬜ Calendar integration

### Phase 3: Advanced Features
- ⬜ Real-time updates (SignalR)
- ⬜ Desk preferences
- ⬜ Recurring bookings
- ⬜ Analytics dashboard

### Phase 4: Enterprise
- ⬜ Multi-office support
- ⬜ Department management
- ⬜ Reporting & analytics
- ⬜ Admin dashboard

---

## Summary

This is a **modern, full-stack web application** with:

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: .NET 8 Minimal API + Entity Framework Core
- **Database**: MySQL 8.0 with proper relationships
- **Documentation**: Comprehensive guides and references
- **Developer Experience**: Hot reload, Swagger UI, automated setup
- **Production Ready**: Can be deployed to any cloud provider

**Architecture Type**: Traditional client-server with REST API
**Design Pattern**: N-tier architecture (Presentation, Business, Data)
**Communication**: HTTP/REST with JSON payloads

