#!/bin/bash

# Treaty Desk Booking Backend Setup Script
# This script automates the initial setup process

set -e  # Exit on error

echo "🚀 Treaty Desk Booking Backend Setup"
echo "===================================="
echo ""

# Check .NET installation
echo "📦 Checking .NET SDK..."
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK not found. Please install .NET 8 SDK from:"
    echo "   https://dotnet.microsoft.com/download/dotnet/8.0"
    exit 1
fi

DOTNET_VERSION=$(dotnet --version)
echo "✅ .NET SDK $DOTNET_VERSION installed"
echo ""

# Check MySQL installation
echo "📦 Checking MySQL..."
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL not found. Please install MySQL 8.0 or higher"
    echo ""
    echo "Options:"
    echo "  1. Install MySQL directly: https://dev.mysql.com/downloads/"
    echo "  2. Use Docker: docker-compose up -d"
    exit 1
fi

MYSQL_VERSION=$(mysql --version)
echo "✅ MySQL installed: $MYSQL_VERSION"
echo ""

# Install EF Core tools
echo "🔧 Installing Entity Framework Core tools..."
dotnet tool install --global dotnet-ef 2>/dev/null || echo "ℹ️  EF Core tools already installed"
echo ""

# Navigate to API project
cd TreatyDeskBooking.Api

# Restore packages
echo "📥 Restoring NuGet packages..."
dotnet restore
echo ""

# Build project
echo "🔨 Building project..."
dotnet build
echo ""

# Database setup
echo "💾 Database Setup"
echo "----------------"
echo ""
echo "Please enter your MySQL connection details:"
read -p "Host [localhost]: " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Port [3306]: " DB_PORT
DB_PORT=${DB_PORT:-3306}

read -p "Username [root]: " DB_USER
DB_USER=${DB_USER:-root}

read -sp "Password: " DB_PASSWORD
echo ""

read -p "Database name [treaty_desk_booking]: " DB_NAME
DB_NAME=${DB_NAME:-treaty_desk_booking}

# Create connection string
CONNECTION_STRING="Server=$DB_HOST;Port=$DB_PORT;Database=$DB_NAME;User=$DB_USER;Password=$DB_PASSWORD;"

# Update appsettings.Development.json
echo ""
echo "📝 Updating connection string..."
cat > appsettings.Development.json <<EOF
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "$CONNECTION_STRING"
  }
}
EOF

echo "✅ Configuration updated"
echo ""

# Test database connection
echo "🔌 Testing database connection..."
if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Failed to connect to database. Please check your credentials."
    exit 1
fi
echo ""

# Create database if it doesn't exist
echo "🏗️  Creating database..."
mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null
echo "✅ Database ready"
echo ""

# Run migrations
echo "🔄 Running database migrations..."
dotnet ef migrations add InitialCreate --force 2>/dev/null || echo "ℹ️  Migration already exists"
dotnet ef database update
echo "✅ Migrations applied"
echo ""

# Success message
echo "✨ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "   1. Start the API: dotnet run"
echo "   2. Open Swagger UI: http://localhost:5000/swagger"
echo "   3. Test endpoints and create your first booking!"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Full documentation"
echo "   - QUICKSTART.md - Quick reference guide"
echo "   - MIGRATION_GUIDE.md - Database migration help"
echo ""
echo "🎉 Happy coding!"

