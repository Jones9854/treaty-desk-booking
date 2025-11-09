# 🚀 Quick Start Guide

## Start Both Frontend and Backend

### Terminal 1: Backend API

```bash
cd backend

# Option 1: Using Docker for MySQL (Recommended)
docker-compose up -d
cd TreatyDeskBooking.Api
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run

# Option 2: Using local MySQL
cd TreatyDeskBooking.Api
# Update appsettings.Development.json with your MySQL credentials
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

✅ Backend running at: **http://localhost:5000**  
✅ Swagger UI at: **http://localhost:5000/swagger**

### Terminal 2: Frontend React App

```bash
# From project root
npm install
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

## Environment Setup (One-time)

Create `.env` file in project root:

```bash
# Copy from example
cp env.example .env

# Or create manually with:
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

---

## Using Docker for MySQL

```bash
# Start MySQL container
cd backend
docker-compose up -d

# Check it's running
docker ps

# View logs
docker logs treaty_desk_booking_mysql

# Stop when done
docker-compose down
```

**Docker MySQL Credentials:**
- User: `treaty_user`
- Password: `treaty_password`
- Database: `treaty_desk_booking`
- Port: `3306`

---

## Testing the Integration

1. **Start Backend** (Terminal 1)
2. **Start Frontend** (Terminal 2)
3. **Open** http://localhost:5173
4. **Login** with any name/email
5. **Book a desk** - should save to database
6. **Refresh page** - booking should persist
7. **Check Swagger** - http://localhost:5000/swagger

---

## Offline Mode

If you don't want to run the backend:

1. At login, check "**Use local storage only (offline mode)**"
2. All data will be stored in browser only
3. No backend/database needed

---

## Verify Everything Works

### ✅ Backend Check
```bash
curl http://localhost:5000/api/users
# Should return: []
```

### ✅ Database Check
```bash
mysql -u treaty_user -p
# password: treaty_password

USE treaty_desk_booking;
SHOW TABLES;
# Should show: Users, Bookings, Activities, Comments
```

### ✅ Frontend Check
- Open http://localhost:5173
- Should see login screen
- No console errors

---

## Common Commands

```bash
# Backend
dotnet run                          # Start API
dotnet watch run                    # Start with hot reload
dotnet ef database update           # Apply migrations
dotnet ef migrations add YourName   # Create new migration

# Frontend  
npm run dev                         # Start dev server
npm run build                       # Build for production
npm run preview                     # Preview production build

# Docker
docker-compose up -d                # Start MySQL
docker-compose down                 # Stop MySQL
docker-compose logs -f              # View logs
```

---

## Troubleshooting

### Backend won't start
```bash
# Check .NET is installed
dotnet --version

# Check MySQL is running
docker ps
# or
mysql --version
```

### Frontend can't connect to backend
```bash
# 1. Check backend is running
curl http://localhost:5000/api/users

# 2. Check .env file exists
cat .env

# 3. Check browser console for CORS errors
```

### Database errors
```bash
# Drop and recreate database
dotnet ef database drop
dotnet ef database update
```

---

## Documentation

- **INTEGRATION_COMPLETE.md** - What was integrated
- **GETTING_STARTED.md** - Detailed setup guide
- **backend/README.md** - Backend API documentation
- **backend/QUICKSTART.md** - Backend quick reference
- **BACKEND_INTEGRATION.md** - Integration details

---

## Quick Test Flow

1. Start backend: `cd backend/TreatyDeskBooking.Api && dotnet run`
2. Start frontend: `npm run dev`
3. Open: http://localhost:5173
4. Login as "Alice" (alice@treaty.com)
5. Book a desk for tomorrow
6. Check Swagger: http://localhost:5000/swagger → GET /api/bookings
7. Should see your booking! 🎉

---

**Ready to go!** 🚀

Need help? Check the documentation files above or the browser/terminal for error messages.

