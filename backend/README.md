# Treaty Desk Booking API

.NET 8 Minimal API backend with MySQL database for the Treaty Desk Booking application.

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- MySQL Server (8.0 or higher)
- [Entity Framework Core Tools](https://docs.microsoft.com/en-us/ef/core/cli/dotnet)

## Setup Instructions

### 1. Install .NET EF Core Tools

```bash
dotnet tool install --global dotnet-ef
```

### 2. Configure MySQL Database

Update the connection string in `appsettings.json` or `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=treaty_desk_booking;User=your_username;Password=your_password;"
  }
}
```

### 3. Create the Database

You can create the database manually in MySQL:

```sql
CREATE DATABASE treaty_desk_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Or let Entity Framework create it automatically when you run migrations.

### 4. Run Database Migrations

Navigate to the API project directory and run:

```bash
cd TreatyDeskBooking.Api

# Create initial migration
dotnet ef migrations add InitialCreate

# Apply migration to database
dotnet ef database update
```

### 5. Run the API

```bash
dotnet run
```

The API will be available at:
- **HTTP**: http://localhost:5000
- **HTTPS**: https://localhost:5001
- **Swagger UI**: http://localhost:5000/swagger

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Bookings

- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get booking by ID
- `GET /api/bookings/user/{userId}` - Get bookings by user
- `GET /api/bookings/date/{date}` - Get bookings by date
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/{id}` - Delete booking
- `DELETE /api/bookings/user/{userId}/date/{date}` - Delete specific user booking

### Activities

- `GET /api/activities` - Get all activities
- `GET /api/activities/{id}` - Get activity by ID
- `POST /api/activities` - Create new activity
- `PUT /api/activities/{id}` - Update activity
- `DELETE /api/activities/{id}` - Delete activity

### Comments

- `GET /api/activities/{activityId}/comments` - Get comments for activity
- `POST /api/comments` - Create new comment
- `DELETE /api/comments/{id}` - Delete comment

## Business Rules

### Desk Bookings

- Maximum **15 desks** available per day
- Users can book maximum **2 days per week**
- Users cannot book the same day twice
- Past dates cannot be booked

## Database Schema

### Users Table
- `Id` (VARCHAR) - Primary Key
- `Name` (VARCHAR) - Required
- `Email` (VARCHAR) - Required, Unique
- `Avatar` (VARCHAR) - Optional

### Bookings Table
- `Id` (VARCHAR) - Primary Key
- `UserId` (VARCHAR) - Foreign Key to Users
- `UserName` (VARCHAR) - Cached user name
- `Date` (VARCHAR) - Booking date (YYYY-MM-DD format)
- `DeskNumber` (INT) - Assigned desk number

### Activities Table
- `Id` (VARCHAR) - Primary Key
- `Type` (VARCHAR) - 'lunch' or 'after-work'
- `Title` (VARCHAR) - Required
- `Description` (VARCHAR)
- `Date` (VARCHAR) - Activity date
- `Time` (VARCHAR) - Activity time
- `CreatedBy` (VARCHAR) - User ID
- `CreatedByName` (VARCHAR) - User name
- `Participants` (VARCHAR) - JSON array of user IDs
- `MaxParticipants` (INT) - Optional limit

### Comments Table
- `Id` (VARCHAR) - Primary Key
- `ActivityId` (VARCHAR) - Foreign Key to Activities
- `UserId` (VARCHAR) - User ID
- `UserName` (VARCHAR) - User name
- `Text` (VARCHAR) - Comment text
- `Timestamp` (VARCHAR) - ISO timestamp

## CORS Configuration

The API is configured to accept requests from:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (Alternative dev port)
- http://localhost:4173 (Vite preview)

Update the CORS policy in `Program.cs` if deploying to production.

## Development

### Hot Reload

The application supports hot reload during development:

```bash
dotnet watch run
```

### View Database with EF Core

```bash
# View pending migrations
dotnet ef migrations list

# View SQL that will be executed
dotnet ef migrations script

# Remove last migration (if not applied)
dotnet ef migrations remove
```

## Troubleshooting

### Connection Issues

If you get MySQL connection errors:

1. Verify MySQL is running: `mysql --version`
2. Check connection string credentials
3. Ensure the database exists
4. Check MySQL port (default: 3306)

### Migration Issues

If migrations fail:

```bash
# Drop the database and recreate
dotnet ef database drop
dotnet ef database update
```

### Port Already in Use

Change the port in `Properties/launchSettings.json` or use:

```bash
dotnet run --urls "http://localhost:5050"
```

## Production Deployment

1. Update connection string for production database
2. Update CORS origins in `Program.cs`
3. Set `ASPNETCORE_ENVIRONMENT=Production`
4. Build and publish:

```bash
dotnet publish -c Release -o ./publish
```

5. Run the published application:

```bash
cd publish
dotnet TreatyDeskBooking.Api.dll
```

## Testing with Swagger

Visit http://localhost:5000/swagger to test the API endpoints interactively.

## License

MIT

