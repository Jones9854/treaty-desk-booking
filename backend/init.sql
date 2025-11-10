-- Initial database setup for Treaty Desk Booking (SQL Server)
-- This script runs automatically when using docker-compose

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'treaty_desk_booking')
BEGIN
    CREATE DATABASE treaty_desk_booking
    COLLATE SQL_Latin1_General_CP1_CI_AS;
END
GO

USE treaty_desk_booking;
GO

-- Database is ready for EF Core migrations

