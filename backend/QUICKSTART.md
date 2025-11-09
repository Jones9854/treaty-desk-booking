# Quick Start Guide

Get the backend API running in 5 minutes!

## Prerequisites

- .NET 8 SDK installed
- MySQL Server running

## Steps

### 1. Install EF Core Tools (if not already installed)

```bash
dotnet tool install --global dotnet-ef
```

### 2. Start MySQL

Make sure MySQL is running on your machine. Default connection:
- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: `password`

### 3. Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE treaty_desk_booking;
exit;
```

### 4. Update Connection String (if needed)

Edit `TreatyDeskBooking.Api/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=treaty_desk_booking;User=root;Password=YOUR_PASSWORD;"
  }
}
```

### 5. Run Migrations

```bash
cd TreatyDeskBooking.Api
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 6. Run the API

```bash
dotnet run
```

✅ API is now running at http://localhost:5000

### 7. Test the API

Open http://localhost:5000/swagger in your browser to see the Swagger UI and test endpoints.

## Seed Sample Data (Optional)

You can create sample users and bookings through the Swagger UI or using curl:

```bash
# Create a user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "user-1",
    "name": "John Doe",
    "email": "john@example.com"
  }'

# Create a booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-1",
    "date": "2025-11-10"
  }'
```

## Next Steps

- Update your React frontend to call the API endpoints
- See `README.md` for detailed documentation
- Configure CORS if accessing from different origin

## Common Issues

**"Unable to connect to MySQL"**
- Check MySQL is running: `mysql --version`
- Verify connection string credentials

**"Database doesn't exist"**
- Create it manually: `CREATE DATABASE treaty_desk_booking;`
- Or let EF Core create it: `dotnet ef database update`

**"Port 5000 already in use"**
- Use different port: `dotnet run --urls "http://localhost:5050"`

Need help? Check the full README.md for troubleshooting guide.

