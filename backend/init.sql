-- Initial database setup for Treaty Desk Booking
-- This script runs automatically when using docker-compose

-- Ensure database uses UTF-8
ALTER DATABASE treaty_desk_booking CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Grant privileges to treaty_user
GRANT ALL PRIVILEGES ON treaty_desk_booking.* TO 'treaty_user'@'%';
FLUSH PRIVILEGES;

