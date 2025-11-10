# Migration Guide: MySQL → Azure SQL Database

Quick guide to migrate from MySQL to Azure SQL Database.

## What Changed

### ✅ Already Updated

1. **NuGet Package**
   - ❌ Removed: `Pomelo.EntityFrameworkCore.MySql`
   - ✅ Added: `Microsoft.EntityFrameworkCore.SqlServer`

2. **Connection String**
   - ❌ Old: `Server=localhost;Port=3306;Database=...`
   - ✅ New: `Server=tcp:your-server.database.windows.net,1433;...`

3. **DbContext Configuration**
   - ❌ Old: `options.UseMySql()`
   - ✅ New: `options.UseSqlServer()`

### 🔄 You Need To Do

1. **Update Connection String** in `appsettings.json`
2. **Remove old migrations** (MySQL-specific)
3. **Create new migrations** (SQL Server)
4. **Apply to database**

## Step-by-Step Migration

### Step 1: Clean Up Old Migrations

```bash
cd TreatyDeskBooking.Api

# Remove MySQL migrations
rm -rf Migrations/
```

### Step 2: Update Connection String

#### For Azure SQL Database:

Edit `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:YOUR-SERVER.database.windows.net,1433;Initial Catalog=treaty_desk_booking;User ID=YOUR-USERNAME;Password=YOUR-PASSWORD;MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```

Replace:
- `YOUR-SERVER` with your Azure SQL server name
- `YOUR-USERNAME` with your admin username
- `YOUR-PASSWORD` with your admin password

#### For Local Development (LocalDB):

Edit `appsettings.Development.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=treaty_desk_booking;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

#### For SQL Server in Docker:

```bash
# Start SQL Server
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Password" \
  -p 1433:1433 --name sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

Then use:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=treaty_desk_booking;User ID=sa;Password=YourStrong@Password;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

### Step 3: Create New Migrations

```bash
# Restore packages (gets SQL Server provider)
dotnet restore

# Create migration
dotnet ef migrations add InitialCreateSqlServer

# You should see: Migrations/XXXXXX_InitialCreateSqlServer.cs created
```

### Step 4: Apply Migrations

```bash
# Apply to database
dotnet ef database update

# You should see:
# Build succeeded.
# Applying migration 'XXXXXX_InitialCreateSqlServer'.
# Done.
```

### Step 5: Verify Tables

**For Azure SQL:**
- Go to Azure Portal → Your Database → Query editor
- Login and run:
```sql
SELECT * FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
```

**For LocalDB:**
- Open SQL Server Object Explorer in Visual Studio
- Connect to `(localdb)\mssqllocaldb`
- Expand `treaty_desk_booking` → Tables

**For Docker SQL Server:**
```bash
docker exec -it sqlserver /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "YourStrong@Password" \
  -Q "USE treaty_desk_booking; SELECT name FROM sys.tables"
```

### Step 6: Test the API

```bash
# Run the API
dotnet run

# Test with curl
curl http://localhost:5000/api/users

# Should return: []
```

## Data Migration (Optional)

If you have existing data in MySQL that you want to migrate:

### Option 1: Manual Export/Import

1. **Export from MySQL:**
```bash
# Export users
mysql -u root -p treaty_desk_booking -e "SELECT * FROM Users" > users.csv

# Export bookings
mysql -u root -p treaty_desk_booking -e "SELECT * FROM Bookings" > bookings.csv
```

2. **Import to SQL Server:**
   - Use Azure Data Studio or SQL Server Management Studio
   - Use "Import Flat File" wizard
   - Or use BULK INSERT

### Option 2: Using a Script

Create a data migration script using EF Core or Dapper to read from MySQL and write to SQL Server.

### Option 3: Fresh Start

Just start with an empty database - your users will create new bookings.

## Differences Between MySQL and SQL Server

### Things That Work the Same
- ✅ All CRUD operations
- ✅ Foreign keys
- ✅ Indexes
- ✅ Transactions
- ✅ Your application code (no changes needed)

### Minor Differences (EF Core handles)
- String columns: `VARCHAR` vs `NVARCHAR`
- Auto-increment: `AUTO_INCREMENT` vs `IDENTITY`
- Boolean: `TINYINT(1)` vs `BIT`
- Date format: Different but EF Core handles it

### Connection String Format
- **MySQL**: `Server=localhost;Port=3306;Database=mydb;User=root;Password=pass;`
- **SQL Server**: `Server=localhost,1433;Database=mydb;User ID=sa;Password=pass;`

## Troubleshooting

### Issue: "Cannot open server"

**Solution:** Check firewall rules (Azure SQL) or ensure SQL Server is running (LocalDB/Docker).

### Issue: "Login failed"

**Solution:** Verify username and password in connection string.

### Issue: "Migration already exists"

**Solution:** Delete `Migrations/` folder and recreate migrations.

### Issue: "Package not found"

**Solution:** 
```bash
dotnet restore
# or
dotnet clean
dotnet restore
```

## Rollback to MySQL (If Needed)

If you need to go back to MySQL:

1. Update `.csproj`:
```xml
<PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="8.0.2" />
<!-- Remove: Microsoft.EntityFrameworkCore.SqlServer -->
```

2. Update `Program.cs`:
```csharp
options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
```

3. Update connection string back to MySQL format

4. Delete `Migrations/` and recreate

## Next Steps

1. ✅ Migrations applied
2. ✅ Tables created
3. ✅ API tested
4. ⬜ Update frontend `.env` if API URL changed
5. ⬜ Test booking workflow end-to-end
6. ⬜ Deploy to Azure App Service (optional)

## Resources

- [Azure SQL Setup Guide](./AZURE_SQL_SETUP.md) - Detailed Azure SQL documentation
- [EF Core SQL Server Provider](https://docs.microsoft.com/en-us/ef/core/providers/sql-server/)
- [Connection Strings](https://www.connectionstrings.com/sql-server/)

---

**Migration complete!** Your backend now uses SQL Server/Azure SQL instead of MySQL. 🎉

