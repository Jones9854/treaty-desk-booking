# 🚀 Getting Started with Treaty Desk Booking

Complete guide to set up both frontend and backend for the Treaty Desk Booking application.

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start (5 Minutes)](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)
6. [Next Steps](#next-steps)

## System Requirements

### For Frontend Only
- ✅ Node.js 18+ 
- ✅ npm or yarn

### For Full Stack (Frontend + Backend)
- ✅ Node.js 18+
- ✅ .NET 8 SDK
- ✅ MySQL 8.0+ (or Docker)

## Quick Start

### Frontend Only (LocalStorage)

```bash
# Install and run
npm install
npm run dev

# Open http://localhost:5173
```

✅ That's it! The app works with localStorage (no database needed).

### Full Stack (Recommended)

**Step 1: Start Backend**
```bash
cd backend
./setup.sh          # macOS/Linux
# or .\setup.ps1    # Windows

cd TreatyDeskBooking.Api
dotnet run
```

**Step 2: Start Frontend**
```bash
# In a new terminal, from project root
npm install
npm run dev
```

**Step 3: Verify**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Swagger UI: http://localhost:5000/swagger

## Detailed Setup

### 1️⃣ Frontend Setup

#### Install Dependencies

```bash
# From project root
npm install
```

This installs:
- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide React (icons)

#### Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173

#### Build for Production

```bash
npm run build
npm run preview
```

### 2️⃣ Backend Setup

#### Prerequisites Check

**Check .NET:**
```bash
dotnet --version
# Should show 8.0.x or higher
```

If not installed, download from: https://dotnet.microsoft.com/download/dotnet/8.0

**Check MySQL:**
```bash
mysql --version
# Should show 8.0.x or higher
```

If not installed, options:
- MySQL: https://dev.mysql.com/downloads/
- Docker: Use provided `docker-compose.yml`

#### Option A: Automated Setup (Recommended)

**macOS/Linux:**
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

**Windows PowerShell:**
```powershell
cd backend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\setup.ps1
```

The script will:
1. ✅ Check prerequisites
2. ✅ Install EF Core tools
3. ✅ Prompt for MySQL credentials
4. ✅ Create database
5. ✅ Run migrations
6. ✅ Configure connection string

#### Option B: Manual Setup

**1. Navigate to API project:**
```bash
cd backend/TreatyDeskBooking.Api
```

**2. Install EF Core CLI tools:**
```bash
dotnet tool install --global dotnet-ef
```

**3. Update connection string:**

Edit `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=treaty_desk_booking;User=root;Password=YOUR_PASSWORD;"
  }
}
```

**4. Create database:**
```bash
# Option 1: Let EF create it
dotnet ef database update

# Option 2: Create manually in MySQL
mysql -u root -p
CREATE DATABASE treaty_desk_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

**5. Create and apply migrations:**
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

**6. Run the API:**
```bash
dotnet run
```

#### Option C: Docker Setup

**1. Start MySQL container:**
```bash
cd backend
docker-compose up -d
```

This creates a MySQL container with:
- Database: `treaty_desk_booking`
- User: `treaty_user`
- Password: `treaty_password`
- Port: `3306`

**2. Update connection string (if using Docker):**

Edit `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=treaty_desk_booking;User=treaty_user;Password=treaty_password;"
  }
}
```

**3. Apply migrations:**
```bash
cd TreatyDeskBooking.Api
dotnet ef migrations add InitialCreate
dotnet ef database update
```

**4. Run the API:**
```bash
dotnet run
```

### 3️⃣ Connect Frontend to Backend

#### Create Environment File

Copy the example:
```bash
cp env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

#### Update Frontend Code

See `BACKEND_INTEGRATION.md` for complete integration guide.

Quick version - create `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const bookingApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    return response.json();
  },
  create: async (booking: any) => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    return response.json();
  },
  // ... more methods
};
```

Update your components to use the API instead of localStorage.

## Verification

### Check Frontend

1. Open http://localhost:5173
2. You should see the login screen
3. Login with any name/email
4. Try booking a desk

### Check Backend

1. Open http://localhost:5000/swagger
2. You should see the Swagger UI with all endpoints
3. Try the `GET /api/bookings` endpoint
4. You should get an empty array or existing bookings

### Check Database

```bash
mysql -u root -p
USE treaty_desk_booking;
SHOW TABLES;
```

You should see:
- `Users`
- `Bookings`
- `Activities`
- `Comments`
- `__EFMigrationsHistory`

### End-to-End Test

1. **Frontend**: Create a user and book a desk
2. **Swagger**: Check `GET /api/bookings` shows the booking
3. **Database**: Verify in MySQL:
   ```sql
   SELECT * FROM Bookings;
   ```
4. **Refresh**: Reload the frontend page - booking should persist

## Troubleshooting

### Frontend Issues

**Port 5173 already in use:**
```bash
# Use different port
npm run dev -- --port 3000
```

**Module not found errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Issues

**"Unable to connect to MySQL":**
- ✅ Check MySQL is running: `mysql --version`
- ✅ Verify credentials in `appsettings.Development.json`
- ✅ Check MySQL service: `sudo service mysql status` (Linux) or check Activity Monitor (Mac)

**"Database does not exist":**
```bash
# Create database manually
mysql -u root -p
CREATE DATABASE treaty_desk_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Then run migrations
dotnet ef database update
```

**"Port 5000 already in use":**
```bash
# Use different port
dotnet run --urls "http://localhost:5050"

# Update CORS in Program.cs to include new port
```

**EF Core tools not found:**
```bash
# Install globally
dotnet tool install --global dotnet-ef

# Or update if already installed
dotnet tool update --global dotnet-ef
```

**Migration fails:**
```bash
# Drop and recreate
dotnet ef database drop
dotnet ef migrations remove
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Docker Issues

**MySQL container won't start:**
```bash
# Check if port 3306 is already in use
lsof -i :3306

# Stop existing MySQL
sudo service mysql stop

# Or use different port in docker-compose.yml
```

**Can't connect to MySQL in Docker:**
```bash
# Check container is running
docker ps

# View logs
docker logs treaty_desk_booking_mysql

# Test connection
docker exec -it treaty_desk_booking_mysql mysql -u treaty_user -p
```

### CORS Issues

If you get CORS errors in browser console:

1. Check backend is running
2. Verify CORS configuration in `Program.cs`:
   ```csharp
   policy.WithOrigins("http://localhost:5173", ...)
   ```
3. Ensure you're accessing frontend from allowed origin

### Integration Issues

**Frontend can't reach backend:**
- ✅ Check both servers are running
- ✅ Verify API URL in `.env` file
- ✅ Check browser console for errors
- ✅ Test backend directly: http://localhost:5000/swagger

## Next Steps

### 1. Explore the Application

- ✅ Book some desks
- ✅ Create social activities
- ✅ Invite colleagues
- ✅ Add comments

### 2. Learn the API

- Open http://localhost:5000/swagger
- Try different endpoints
- Review the API documentation in `backend/README.md`

### 3. Customize

- Change colors in `tailwind.config.js`
- Modify desk capacity in `src/components/DeskBooking.tsx`
- Add new features

### 4. Deploy

**Frontend:**
```bash
npm run build
npm run deploy  # GitHub Pages
```

**Backend:**
- Deploy to Azure App Service
- Deploy to AWS
- Deploy to your own server

See `backend/README.md` for production deployment guide.

## 📚 Documentation

- **README.md** - Main project overview
- **backend/README.md** - Complete API documentation
- **backend/QUICKSTART.md** - Quick reference
- **backend/MIGRATION_GUIDE.md** - Database help
- **BACKEND_INTEGRATION.md** - Integration guide
- **BACKEND_SUMMARY.md** - What was built

## 🆘 Need Help?

1. Check the documentation files above
2. Review error messages carefully
3. Check the Swagger UI for API issues
4. Verify database connection
5. Check browser console for frontend errors

## ✅ Checklist

### Initial Setup
- [ ] Node.js installed
- [ ] .NET 8 SDK installed (for backend)
- [ ] MySQL installed (for backend)
- [ ] Git configured

### Frontend
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server runs (`npm run dev`)
- [ ] App loads in browser
- [ ] Can create bookings

### Backend
- [ ] API project builds (`dotnet build`)
- [ ] Database created
- [ ] Migrations applied
- [ ] API runs (`dotnet run`)
- [ ] Swagger UI accessible

### Integration
- [ ] Environment variables configured
- [ ] API service created
- [ ] Frontend calls backend
- [ ] Data persists in database
- [ ] Can refresh without losing data

## 🎉 Success!

If you've completed all the steps above, you now have:
- ✅ A fully functional React frontend
- ✅ A .NET backend API with MySQL
- ✅ Database persistence
- ✅ Swagger documentation
- ✅ Development environment ready

**Start building!** 🚀

---

**Quick Commands Reference:**

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
cd backend/TreatyDeskBooking.Api
dotnet run           # Start API
dotnet watch run     # Start with hot reload
dotnet ef database update    # Apply migrations
dotnet test          # Run tests (if added)

# Docker
docker-compose up -d         # Start MySQL
docker-compose down          # Stop MySQL
docker logs treaty_desk_booking_mysql  # View logs
```

