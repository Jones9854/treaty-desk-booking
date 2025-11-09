# Treaty Desk Booking Backend Setup Script (Windows PowerShell)
# This script automates the initial setup process

$ErrorActionPreference = "Stop"

Write-Host "🚀 Treaty Desk Booking Backend Setup" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check .NET installation
Write-Host "📦 Checking .NET SDK..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host "✅ .NET SDK $dotnetVersion installed" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ .NET SDK not found. Please install .NET 8 SDK from:" -ForegroundColor Red
    Write-Host "   https://dotnet.microsoft.com/download/dotnet/8.0"
    exit 1
}

# Check MySQL installation
Write-Host "📦 Checking MySQL..." -ForegroundColor Yellow
try {
    $mysqlVersion = mysql --version
    Write-Host "✅ MySQL installed: $mysqlVersion" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ MySQL not found. Please install MySQL 8.0 or higher" -ForegroundColor Red
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  1. Install MySQL directly: https://dev.mysql.com/downloads/"
    Write-Host "  2. Use Docker: docker-compose up -d"
    exit 1
}

# Install EF Core tools
Write-Host "🔧 Installing Entity Framework Core tools..." -ForegroundColor Yellow
try {
    dotnet tool install --global dotnet-ef 2>&1 | Out-Null
} catch {
    Write-Host "ℹ️  EF Core tools already installed" -ForegroundColor Blue
}
Write-Host ""

# Navigate to API project
Set-Location -Path "TreatyDeskBooking.Api"

# Restore packages
Write-Host "📥 Restoring NuGet packages..." -ForegroundColor Yellow
dotnet restore
Write-Host ""

# Build project
Write-Host "🔨 Building project..." -ForegroundColor Yellow
dotnet build
Write-Host ""

# Database setup
Write-Host "💾 Database Setup" -ForegroundColor Cyan
Write-Host "----------------" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please enter your MySQL connection details:" -ForegroundColor Yellow

$DB_HOST = Read-Host "Host [localhost]"
if ([string]::IsNullOrWhiteSpace($DB_HOST)) { $DB_HOST = "localhost" }

$DB_PORT = Read-Host "Port [3306]"
if ([string]::IsNullOrWhiteSpace($DB_PORT)) { $DB_PORT = "3306" }

$DB_USER = Read-Host "Username [root]"
if ([string]::IsNullOrWhiteSpace($DB_USER)) { $DB_USER = "root" }

$DB_PASSWORD = Read-Host "Password" -AsSecureString
$DB_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD)
)

$DB_NAME = Read-Host "Database name [treaty_desk_booking]"
if ([string]::IsNullOrWhiteSpace($DB_NAME)) { $DB_NAME = "treaty_desk_booking" }

# Create connection string
$CONNECTION_STRING = "Server=$DB_HOST;Port=$DB_PORT;Database=$DB_NAME;User=$DB_USER;Password=$DB_PASSWORD_PLAIN;"

# Update appsettings.Development.json
Write-Host ""
Write-Host "📝 Updating connection string..." -ForegroundColor Yellow

$appsettings = @{
    Logging = @{
        LogLevel = @{
            Default = "Information"
            "Microsoft.AspNetCore" = "Warning"
            "Microsoft.EntityFrameworkCore.Database.Command" = "Information"
        }
    }
    ConnectionStrings = @{
        DefaultConnection = $CONNECTION_STRING
    }
} | ConvertTo-Json -Depth 10

$appsettings | Out-File -FilePath "appsettings.Development.json" -Encoding UTF8

Write-Host "✅ Configuration updated" -ForegroundColor Green
Write-Host ""

# Test database connection
Write-Host "🔌 Testing database connection..." -ForegroundColor Yellow
try {
    $testQuery = "SELECT 1;"
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p"$DB_PASSWORD_PLAIN" -e $testQuery 2>&1 | Out-Null
    Write-Host "✅ Database connection successful" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to connect to database. Please check your credentials." -ForegroundColor Red
    exit 1
}
Write-Host ""

# Create database if it doesn't exist
Write-Host "🏗️  Creating database..." -ForegroundColor Yellow
$createDbQuery = "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p"$DB_PASSWORD_PLAIN" -e $createDbQuery 2>&1 | Out-Null
Write-Host "✅ Database ready" -ForegroundColor Green
Write-Host ""

# Run migrations
Write-Host "🔄 Running database migrations..." -ForegroundColor Yellow
try {
    dotnet ef migrations add InitialCreate --force 2>&1 | Out-Null
} catch {
    Write-Host "ℹ️  Migration already exists" -ForegroundColor Blue
}
dotnet ef database update
Write-Host "✅ Migrations applied" -ForegroundColor Green
Write-Host ""

# Success message
Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Start the API: dotnet run"
Write-Host "   2. Open Swagger UI: http://localhost:5000/swagger"
Write-Host "   3. Test endpoints and create your first booking!"
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - README.md - Full documentation"
Write-Host "   - QUICKSTART.md - Quick reference guide"
Write-Host "   - MIGRATION_GUIDE.md - Database migration help"
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green

