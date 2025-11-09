# Database Migration Guide

This guide explains how to manage database migrations for the Treaty Desk Booking API.

## Creating Migrations

Whenever you make changes to the entity models (User, Booking, Activity, Comment), you need to create a migration:

```bash
cd TreatyDeskBooking.Api

# Create a new migration with a descriptive name
dotnet ef migrations add AddNewFeature

# Apply the migration to the database
dotnet ef database update
```

## Common Migration Commands

### List All Migrations

```bash
dotnet ef migrations list
```

### View SQL Script

Preview the SQL that will be executed:

```bash
dotnet ef migrations script
```

### Remove Last Migration

If you haven't applied the migration yet:

```bash
dotnet ef migrations remove
```

### Rollback to Specific Migration

```bash
dotnet ef database update MigrationName
```

### Reset Database

Drop and recreate:

```bash
# Drop the database
dotnet ef database drop

# Recreate and apply all migrations
dotnet ef database update
```

## Initial Migration Steps

When setting up the project for the first time:

### 1. Create Initial Migration

```bash
cd TreatyDeskBooking.Api
dotnet ef migrations add InitialCreate
```

This creates the migration files in the `Migrations` folder.

### 2. Apply to Database

```bash
dotnet ef database update
```

This executes the migration and creates all tables in MySQL.

### 3. Verify in MySQL

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

## Database Schema

### Users Table

```sql
CREATE TABLE Users (
    Id VARCHAR(255) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Avatar VARCHAR(500)
);
```

### Bookings Table

```sql
CREATE TABLE Bookings (
    Id VARCHAR(255) PRIMARY KEY,
    UserId VARCHAR(255) NOT NULL,
    UserName VARCHAR(100) NOT NULL,
    Date VARCHAR(10) NOT NULL,
    DeskNumber INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    INDEX idx_user_date (UserId, Date)
);
```

### Activities Table

```sql
CREATE TABLE Activities (
    Id VARCHAR(255) PRIMARY KEY,
    Type VARCHAR(20) NOT NULL,
    Title VARCHAR(200) NOT NULL,
    Description VARCHAR(1000),
    Date VARCHAR(10) NOT NULL,
    Time VARCHAR(10) NOT NULL,
    CreatedBy VARCHAR(255) NOT NULL,
    CreatedByName VARCHAR(100) NOT NULL,
    Participants VARCHAR(2000),
    MaxParticipants INT
);
```

### Comments Table

```sql
CREATE TABLE Comments (
    Id VARCHAR(255) PRIMARY KEY,
    ActivityId VARCHAR(255) NOT NULL,
    UserId VARCHAR(255) NOT NULL,
    UserName VARCHAR(100) NOT NULL,
    Text VARCHAR(1000) NOT NULL,
    Timestamp VARCHAR(255) NOT NULL,
    FOREIGN KEY (ActivityId) REFERENCES Activities(Id) ON DELETE CASCADE
);
```

## Troubleshooting

### "Build failed"

Make sure the project compiles:

```bash
dotnet build
```

### "Unable to create migration"

Check that:
1. EF Core tools are installed: `dotnet ef --version`
2. You're in the correct directory (TreatyDeskBooking.Api)
3. The project references are correct in the .csproj file

### "Cannot connect to MySQL"

Verify:
1. MySQL is running
2. Connection string in appsettings.json is correct
3. Database exists (or will be created automatically)

### Migration Already Applied

If you need to modify an applied migration:

1. Rollback: `dotnet ef database update PreviousMigration`
2. Remove: `dotnet ef migrations remove`
3. Make changes to your models
4. Create new migration: `dotnet ef migrations add UpdatedFeature`
5. Apply: `dotnet ef database update`

## Production Considerations

### Before Deploying

1. **Backup the database** before applying migrations in production
2. **Test migrations** in a staging environment first
3. **Review the SQL script**: `dotnet ef migrations script`
4. Consider using **idempotent scripts**: `dotnet ef migrations script --idempotent`

### Applying Migrations in Production

Option 1: Manual deployment
```bash
# Generate SQL script
dotnet ef migrations script -o migration.sql

# Review and apply manually in MySQL
mysql -u user -p database < migration.sql
```

Option 2: Automatic on startup
Add this to Program.cs:
```csharp
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}
```

## Best Practices

1. **Descriptive names**: Use clear migration names
   - ✅ `AddDeskNumberToBookings`
   - ❌ `Update1`

2. **Small migrations**: One logical change per migration

3. **Test rollback**: Ensure migrations can be reverted

4. **Version control**: Commit migration files to git

5. **Data migrations**: For data changes, create empty migration and add SQL:
   ```bash
   dotnet ef migrations add UpdateExistingData
   # Edit the generated migration file to add SQL
   ```

## Resources

- [EF Core Migrations Documentation](https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- [Pomelo MySQL Provider](https://github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql)

