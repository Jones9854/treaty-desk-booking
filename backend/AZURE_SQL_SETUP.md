# Azure SQL Database Setup Guide

Complete guide to configure the Treaty Desk Booking API with Azure SQL Database.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Create Azure SQL Database](#create-azure-sql-database)
3. [Configure Connection String](#configure-connection-string)
4. [Apply Migrations](#apply-migrations)
5. [Local Development](#local-development)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

- ✅ Azure account (free tier works)
- ✅ .NET 8 SDK
- ✅ Azure CLI (optional) or Azure Portal access
- ✅ SQL Server Management Studio or Azure Data Studio (optional)

## Create Azure SQL Database

### Option 1: Azure Portal (Easiest)

1. **Go to Azure Portal**: https://portal.azure.com

2. **Create SQL Database**:
   - Click "Create a resource"
   - Search for "SQL Database"
   - Click "Create"

3. **Basic Configuration**:
   ```
   Subscription: [Your subscription]
   Resource Group: Create new → "treaty-rg"
   Database name: treaty_desk_booking
   Server: Create new
   ```

4. **Create SQL Server**:
   ```
   Server name: treaty-sql-server (must be globally unique)
   Location: [Choose closest region]
   Authentication: SQL authentication
   Server admin login: treatyadmin
   Password: [Strong password - save this!]
   ```

5. **Compute + Storage**:
   - Click "Configure database"
   - Choose "Basic" (5 DTUs, 2GB) - cheapest option
   - Or "Serverless" for auto-pause

6. **Networking**:
   - Connectivity: Public endpoint
   - Firewall rules: 
     - ✅ Add current client IP address
     - ✅ Allow Azure services to access server

7. **Review + Create**:
   - Review settings
   - Click "Create"
   - Wait 2-5 minutes for deployment

### Option 2: Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name treaty-rg --location eastus

# Create SQL server
az sql server create \
  --name treaty-sql-server \
  --resource-group treaty-rg \
  --location eastus \
  --admin-user treatyadmin \
  --admin-password "YourStrongPassword123!"

# Configure firewall
az sql server firewall-rule create \
  --resource-group treaty-rg \
  --server treaty-sql-server \
  --name AllowMyIP \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Create database
az sql db create \
  --resource-group treaty-rg \
  --server treaty-sql-server \
  --name treaty_desk_booking \
  --service-objective Basic
```

## Configure Connection String

### Get Connection String from Azure Portal

1. Go to your SQL Database in Azure Portal
2. Click "Connection strings" in left menu
3. Copy the "ADO.NET" connection string
4. It will look like:
   ```
   Server=tcp:treaty-sql-server.database.windows.net,1433;Initial Catalog=treaty_desk_booking;Persist Security Info=False;User ID=treatyadmin;Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
   ```

### Update appsettings.json

Edit `TreatyDeskBooking.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:treaty-sql-server.database.windows.net,1433;Initial Catalog=treaty_desk_booking;Persist Security Info=False;User ID=treatyadmin;Password=YourStrongPassword123!;MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
```

### Secure Connection String (Production)

**Never commit passwords to git!** Use one of these methods:

#### Option 1: User Secrets (Local Development)

```bash
cd TreatyDeskBooking.Api

# Initialize user secrets
dotnet user-secrets init

# Set connection string
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=tcp:treaty-sql-server.database.windows.net,1433;Initial Catalog=treaty_desk_booking;User ID=treatyadmin;Password=YourPassword;MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=False;"
```

#### Option 2: Environment Variables

```bash
export ConnectionStrings__DefaultConnection="Server=tcp:..."
```

#### Option 3: Azure Key Vault (Production)

Use Azure Key Vault to store secrets and reference them in your app.

## Apply Migrations

### 1. Remove Old MySQL Migrations

```bash
cd TreatyDeskBooking.Api

# Remove existing migrations folder (if switching from MySQL)
rm -rf Migrations/
```

### 2. Create New Migrations for SQL Server

```bash
# Create initial migration
dotnet ef migrations add InitialCreateSqlServer

# Apply to Azure SQL Database
dotnet ef database update
```

### 3. Verify Migration

The command will:
- ✅ Connect to Azure SQL Database
- ✅ Create all tables (Users, Bookings, Activities, Comments)
- ✅ Set up foreign keys and indexes
- ✅ Create migration history table

### Check Tables in Azure

**Using Azure Portal:**
1. Go to your database
2. Click "Query editor"
3. Login with SQL authentication
4. Run:
   ```sql
   SELECT TABLE_NAME 
   FROM INFORMATION_SCHEMA.TABLES 
   WHERE TABLE_TYPE = 'BASE TABLE'
   ```

**Using Azure Data Studio:**
1. Connect to: `treaty-sql-server.database.windows.net`
2. Database: `treaty_desk_booking`
3. Run queries to verify tables

## Local Development

### Option 1: Use Azure SQL Database

Just use the Azure connection string in `appsettings.Development.json`.

### Option 2: Use LocalDB (Windows Only)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=treaty_desk_booking;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

Then run:
```bash
dotnet ef database update
```

### Option 3: Use SQL Server Express (Any OS)

Download SQL Server Express and use:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=treaty_desk_booking;User ID=sa;Password=YourPassword;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

### Option 4: Use Docker SQL Server

```bash
# Run SQL Server in Docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Password" \
  -p 1433:1433 --name sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest

# Connection string:
# Server=localhost,1433;Database=treaty_desk_booking;User ID=sa;Password=YourStrong@Password;TrustServerCertificate=True;
```

## Run the Application

```bash
cd TreatyDeskBooking.Api
dotnet run
```

You should see:
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
```

## Verify Connection

### Test with Swagger

1. Open http://localhost:5000/swagger
2. Try `GET /api/users`
3. Should return `[]` (empty array)

### Create Test Data

```bash
# Create a user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@treaty.com"}'

# Verify in Azure
# Go to Azure Portal → Query Editor
# Run: SELECT * FROM Users
```

## Troubleshooting

### Error: "Cannot open server"

**Problem:** Firewall blocking connection

**Solution:**
1. Go to Azure Portal → SQL Server → Networking
2. Add your current IP to firewall rules
3. Or temporarily enable "Allow Azure services"

### Error: "Login failed for user"

**Problem:** Wrong credentials

**Solution:**
1. Verify username and password
2. Check connection string format
3. Ensure you're using SQL authentication

### Error: "SSL connection is required"

**Problem:** Missing encryption settings

**Solution:** Add to connection string:
```
;Encrypt=True;TrustServerCertificate=False;
```

### Error: "The SELECT permission was denied"

**Problem:** User doesn't have permissions

**Solution:** Grant permissions in Azure Portal:
```sql
ALTER ROLE db_owner ADD MEMBER [treatyadmin]
```

### Migration Fails

**Problem:** EF Core can't connect

**Solution:**
```bash
# Test connection string
dotnet ef dbcontext info

# If fails, check:
# 1. Firewall rules
# 2. Connection string format
# 3. Server name is correct
```

### Slow Performance

**Problem:** Using free tier

**Solutions:**
1. Upgrade to higher tier
2. Use connection pooling (enabled by default)
3. Add indexes to frequently queried columns
4. Use serverless with auto-pause

## Connection String Formats

### Azure SQL Database
```
Server=tcp:{server}.database.windows.net,1433;
Initial Catalog={database};
User ID={username};
Password={password};
Encrypt=True;
TrustServerCertificate=False;
Connection Timeout=30;
MultipleActiveResultSets=True;
```

### LocalDB (Development)
```
Server=(localdb)\\mssqllocaldb;
Database={database};
Trusted_Connection=True;
MultipleActiveResultSets=true;
```

### SQL Server Express
```
Server=localhost;
Database={database};
User ID={username};
Password={password};
TrustServerCertificate=True;
MultipleActiveResultSets=true;
```

### Docker SQL Server
```
Server=localhost,1433;
Database={database};
User ID=sa;
Password={password};
TrustServerCertificate=True;
MultipleActiveResultSets=true;
```

## Cost Management

### Free Tier
- ✅ First 250 GB free per month (S0 tier)
- ✅ Good for development/testing

### Basic Tier
- 💰 ~$5/month
- ✅ 2 GB storage
- ✅ 5 DTUs
- ✅ Good for small apps

### Serverless
- 💰 Pay per use
- ✅ Auto-pause when idle
- ✅ Auto-scale
- ✅ Best for intermittent workloads

### Cost Optimization Tips
1. Use serverless with auto-pause
2. Start with Basic tier
3. Set up budget alerts
4. Delete when not in use
5. Use development database separately

## Security Best Practices

1. **Never commit connection strings with passwords**
   - Use user secrets
   - Use environment variables
   - Use Azure Key Vault

2. **Use firewall rules**
   - Only allow specific IPs
   - Don't use 0.0.0.0 - 255.255.255.255

3. **Use strong passwords**
   - 12+ characters
   - Mix of uppercase, lowercase, numbers, symbols

4. **Enable auditing** (Optional)
   - Track database access
   - Monitor for suspicious activity

5. **Use managed identity** (Production)
   - No passwords needed
   - Azure handles authentication

## Deployment Checklist

- [ ] Azure SQL Database created
- [ ] Firewall rules configured
- [ ] Connection string updated
- [ ] Migrations applied
- [ ] Tables verified in Azure
- [ ] Test API endpoints work
- [ ] Connection string secured (not in git)
- [ ] Budget alerts set up (optional)

## Useful Azure CLI Commands

```bash
# List all databases
az sql db list --resource-group treaty-rg --server treaty-sql-server

# Show database details
az sql db show --name treaty_desk_booking --resource-group treaty-rg --server treaty-sql-server

# Delete database (careful!)
az sql db delete --name treaty_desk_booking --resource-group treaty-rg --server treaty-sql-server

# Update firewall
az sql server firewall-rule update --resource-group treaty-rg --server treaty-sql-server --name AllowMyIP --start-ip-address 1.2.3.4 --end-ip-address 1.2.3.4
```

## Next Steps

1. ✅ Database is set up
2. ✅ Migrations applied
3. ✅ API running
4. ⬜ Deploy API to Azure App Service
5. ⬜ Configure managed identity
6. ⬜ Set up CI/CD pipeline

## Resources

- [Azure SQL Documentation](https://docs.microsoft.com/en-us/azure/sql-database/)
- [EF Core with SQL Server](https://docs.microsoft.com/en-us/ef/core/providers/sql-server/)
- [Connection String Reference](https://www.connectionstrings.com/sql-server/)
- [Azure SQL Pricing](https://azure.microsoft.com/en-us/pricing/details/sql-database/)

---

**Ready to go!** Your backend now uses Azure SQL Database for production-grade cloud storage. 🚀
