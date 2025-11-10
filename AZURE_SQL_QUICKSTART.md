# 🚀 Azure SQL Quick Start

Your backend has been converted from MySQL to Azure SQL Database!

## ✅ What Changed

1. **Package**: Now using `Microsoft.EntityFrameworkCore.SqlServer` (was Pomelo MySQL)
2. **Configuration**: `UseSqlServer()` (was `UseMySql()`)
3. **Connection String**: SQL Server format (was MySQL format)

## 🎯 Quick Setup Options

### Option 1: Use Azure SQL Database (Production)

**Best for:** Cloud deployment, production apps

1. **Create Azure SQL Database** (see `backend/AZURE_SQL_SETUP.md` for detailed steps)
   - Go to https://portal.azure.com
   - Create SQL Database
   - Note: Server name, username, password

2. **Update Connection String** in `backend/TreatyDeskBooking.Api/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=tcp:YOUR-SERVER.database.windows.net,1433;Initial Catalog=treaty_desk_booking;User ID=YOUR-USERNAME;Password=YOUR-PASSWORD;MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
     }
   }
   ```

3. **Apply Migrations**:
   ```bash
   cd backend/TreatyDeskBooking.Api
   rm -rf Migrations/  # Remove old MySQL migrations
   dotnet ef migrations add InitialCreateSqlServer
   dotnet ef database update
   ```

4. **Run**:
   ```bash
   dotnet run
   ```

---

### Option 2: Use LocalDB (Local Development - Windows Only)

**Best for:** Local Windows development, quick testing

1. **Connection string already configured!** Check `appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=treaty_desk_booking;Trusted_Connection=True;MultipleActiveResultSets=true"
     }
   }
   ```

2. **Apply Migrations**:
   ```bash
   cd backend/TreatyDeskBooking.Api
   rm -rf Migrations/  # Remove old MySQL migrations
   dotnet ef migrations add InitialCreateSqlServer
   dotnet ef database update
   ```

3. **Run**:
   ```bash
   dotnet run
   ```

---

### Option 3: Use SQL Server in Docker (Cross-Platform)

**Best for:** Mac/Linux development, containerized setup

1. **Start SQL Server Container**:
   ```bash
   docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Password123" \
     -p 1433:1433 --name sqlserver \
     -d mcr.microsoft.com/mssql/server:2022-latest
   ```

2. **Update Connection String** in `appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost,1433;Database=treaty_desk_booking;User ID=sa;Password=YourStrong@Password123;TrustServerCertificate=True;MultipleActiveResultSets=true"
     }
   }
   ```

3. **Apply Migrations**:
   ```bash
   cd backend/TreatyDeskBooking.Api
   rm -rf Migrations/  # Remove old MySQL migrations
   dotnet ef migrations add InitialCreateSqlServer
   dotnet ef database update
   ```

4. **Run**:
   ```bash
   dotnet run
   ```

---

## 🧪 Test It Works

1. **Start the backend**:
   ```bash
   cd backend/TreatyDeskBooking.Api
   dotnet run
   ```

2. **Open Swagger**: http://localhost:5000/swagger

3. **Test an endpoint**:
   - Try `GET /api/users`
   - Should return `[]`

4. **Create test data**:
   ```bash
   curl -X POST http://localhost:5000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@treaty.com"}'
   ```

5. **Verify**:
   - Try `GET /api/users` again
   - Should see your test user!

---

## 📝 Migration Steps (If Coming from MySQL)

1. **Remove old migrations**:
   ```bash
   cd backend/TreatyDeskBooking.Api
   rm -rf Migrations/
   ```

2. **Restore packages** (gets SQL Server provider):
   ```bash
   dotnet restore
   ```

3. **Create new migrations**:
   ```bash
   dotnet ef migrations add InitialCreateSqlServer
   ```

4. **Apply to database**:
   ```bash
   dotnet ef database update
   ```

---

## 🔧 Connection String Formats Reference

### Azure SQL Database
```
Server=tcp:YOUR-SERVER.database.windows.net,1433;
Initial Catalog=treaty_desk_booking;
User ID=YOUR-USERNAME;
Password=YOUR-PASSWORD;
MultipleActiveResultSets=True;
Encrypt=True;
TrustServerCertificate=False;
Connection Timeout=30;
```

### LocalDB (Windows)
```
Server=(localdb)\\mssqllocaldb;
Database=treaty_desk_booking;
Trusted_Connection=True;
MultipleActiveResultSets=true;
```

### Docker SQL Server
```
Server=localhost,1433;
Database=treaty_desk_booking;
User ID=sa;
Password=YOUR-PASSWORD;
TrustServerCertificate=True;
MultipleActiveResultSets=true;
```

---

## 🐛 Troubleshooting

### "Cannot open server"
- **Azure SQL**: Check firewall rules in Azure Portal
- **LocalDB**: Run `sqllocaldb start mssqllocaldb`
- **Docker**: Check container is running: `docker ps`

### "Login failed"
- Verify username and password in connection string
- For Azure: Check server admin credentials

### "Migration failed"
- Delete `Migrations/` folder and try again
- Check connection string is correct
- Verify database exists

---

## 📚 Documentation

- **backend/AZURE_SQL_SETUP.md** - Complete Azure SQL guide
- **backend/MIGRATION_FROM_MYSQL.md** - Detailed migration steps
- **backend/README.md** - General backend documentation

---

## ✨ That's It!

Your backend now uses **SQL Server / Azure SQL Database** instead of MySQL.

**No changes needed in:**
- ✅ Frontend code
- ✅ API endpoints
- ✅ Business logic
- ✅ Data models

Everything works exactly the same, just with a different database! 🎉

**Recommended:** Use **Docker SQL Server** for local development (works on Mac/Linux/Windows).

**For Production:** Use **Azure SQL Database** for cloud deployment.

