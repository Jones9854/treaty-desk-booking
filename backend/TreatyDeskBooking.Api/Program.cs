using Microsoft.EntityFrameworkCore;
using TreatyDeskBooking.Api.Data;
using TreatyDeskBooking.Api.Models;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure MySQL connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=localhost;Port=3306;Database=treaty_desk_booking;User=root;Password=password;";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173", 
                    "http://localhost:5174",  // Vite alternate port
                    "http://localhost:3000", 
                    "http://localhost:4173"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

// ==================== USER ENDPOINTS ====================

// Get all users
app.MapGet("/api/users", async (ApplicationDbContext db) =>
{
    return await db.Users.ToListAsync();
});

// Get user by ID
app.MapGet("/api/users/{id}", async (string id, ApplicationDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    return user is not null ? Results.Ok(user) : Results.NotFound();
});

// Create user
app.MapPost("/api/users", async (User user, ApplicationDbContext db) =>
{
    if (string.IsNullOrEmpty(user.Id))
    {
        user.Id = Guid.NewGuid().ToString();
    }
    
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Created($"/api/users/{user.Id}", user);
});

// Update user
app.MapPut("/api/users/{id}", async (string id, User updatedUser, ApplicationDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    if (user is null) return Results.NotFound();

    user.Name = updatedUser.Name;
    user.Email = updatedUser.Email;
    user.Avatar = updatedUser.Avatar;

    await db.SaveChangesAsync();
    return Results.Ok(user);
});

// Delete user
app.MapDelete("/api/users/{id}", async (string id, ApplicationDbContext db) =>
{
    var user = await db.Users.FindAsync(id);
    if (user is null) return Results.NotFound();

    db.Users.Remove(user);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ==================== BOOKING ENDPOINTS ====================

// Get all bookings
app.MapGet("/api/bookings", async (ApplicationDbContext db) =>
{
    return await db.Bookings.OrderBy(b => b.Date).ToListAsync();
});

// Get bookings by user ID
app.MapGet("/api/bookings/user/{userId}", async (string userId, ApplicationDbContext db) =>
{
    return await db.Bookings
        .Where(b => b.UserId == userId)
        .OrderBy(b => b.Date)
        .ToListAsync();
});

// Get bookings by date
app.MapGet("/api/bookings/date/{date}", async (string date, ApplicationDbContext db) =>
{
    return await db.Bookings
        .Where(b => b.Date == date)
        .OrderBy(b => b.DeskNumber)
        .ToListAsync();
});

// Get booking by ID
app.MapGet("/api/bookings/{id}", async (string id, ApplicationDbContext db) =>
{
    var booking = await db.Bookings.FindAsync(id);
    return booking is not null ? Results.Ok(booking) : Results.NotFound();
});

// Create booking
app.MapPost("/api/bookings", async (Booking booking, ApplicationDbContext db) =>
{
    // Validate user exists
    var user = await db.Users.FindAsync(booking.UserId);
    if (user is null)
    {
        return Results.BadRequest(new { error = "User not found" });
    }

    // Check if user already has a booking for this date
    var existingBooking = await db.Bookings
        .FirstOrDefaultAsync(b => b.UserId == booking.UserId && b.Date == booking.Date);
    
    if (existingBooking is not null)
    {
        return Results.BadRequest(new { error = "You have already booked this day!" });
    }

    // Check weekly booking limit (2 per week)
    var startOfWeek = DateTime.Now.Date;
    var endOfWeek = startOfWeek.AddDays(7);
    
    var weeklyBookings = await db.Bookings
        .Where(b => b.UserId == booking.UserId)
        .ToListAsync();
    
    var weeklyCount = weeklyBookings.Count(b =>
    {
        if (DateTime.TryParse(b.Date, out var bookingDate))
        {
            return bookingDate >= startOfWeek && bookingDate < endOfWeek;
        }
        return false;
    });

    if (weeklyCount >= 2)
    {
        return Results.BadRequest(new { error = "You can only book 2 days per week!" });
    }

    // Check desk availability (max 15 desks per day)
    var dateBookings = await db.Bookings
        .Where(b => b.Date == booking.Date)
        .CountAsync();
    
    if (dateBookings >= 15)
    {
        return Results.BadRequest(new { error = "Sorry, all desks are booked for this day!" });
    }

    // Generate ID if not provided
    if (string.IsNullOrEmpty(booking.Id))
    {
        booking.Id = Guid.NewGuid().ToString();
    }

    // Set desk number
    booking.DeskNumber = dateBookings + 1;
    booking.UserName = user.Name;

    db.Bookings.Add(booking);
    await db.SaveChangesAsync();
    return Results.Created($"/api/bookings/{booking.Id}", booking);
});

// Delete booking
app.MapDelete("/api/bookings/{id}", async (string id, ApplicationDbContext db) =>
{
    var booking = await db.Bookings.FindAsync(id);
    if (booking is null) return Results.NotFound();

    db.Bookings.Remove(booking);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Delete booking by user and date
app.MapDelete("/api/bookings/user/{userId}/date/{date}", async (string userId, string date, ApplicationDbContext db) =>
{
    var booking = await db.Bookings
        .FirstOrDefaultAsync(b => b.UserId == userId && b.Date == date);
    
    if (booking is null) return Results.NotFound();

    db.Bookings.Remove(booking);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ==================== ACTIVITY ENDPOINTS ====================

// Get all activities
app.MapGet("/api/activities", async (ApplicationDbContext db) =>
{
    var activities = await db.Activities
        .OrderByDescending(a => a.Date)
        .ThenByDescending(a => a.Time)
        .ToListAsync();
    
    return activities.Select(a => new
    {
        a.Id,
        a.Type,
        a.Title,
        a.Description,
        a.Date,
        a.Time,
        a.CreatedBy,
        a.CreatedByName,
        Participants = string.IsNullOrEmpty(a.Participants) 
            ? new string[0] 
            : JsonSerializer.Deserialize<string[]>(a.Participants) ?? new string[0],
        a.MaxParticipants
    }).ToList();
});

// Get activity by ID
app.MapGet("/api/activities/{id}", async (string id, ApplicationDbContext db) =>
{
    var activity = await db.Activities.FindAsync(id);
    if (activity is null) return Results.NotFound();
    
    return Results.Ok(new
    {
        activity.Id,
        activity.Type,
        activity.Title,
        activity.Description,
        activity.Date,
        activity.Time,
        activity.CreatedBy,
        activity.CreatedByName,
        Participants = string.IsNullOrEmpty(activity.Participants) 
            ? new string[0] 
            : JsonSerializer.Deserialize<string[]>(activity.Participants) ?? new string[0],
        activity.MaxParticipants
    });
});

// Create activity
app.MapPost("/api/activities", async (ActivityDto activityDto, ApplicationDbContext db) =>
{
    var activity = new Activity
    {
        Id = string.IsNullOrEmpty(activityDto.Id) ? Guid.NewGuid().ToString() : activityDto.Id,
        Type = activityDto.Type,
        Title = activityDto.Title,
        Description = activityDto.Description,
        Date = activityDto.Date,
        Time = activityDto.Time,
        CreatedBy = activityDto.CreatedBy,
        CreatedByName = activityDto.CreatedByName,
        Participants = JsonSerializer.Serialize(activityDto.Participants ?? new string[0]),
        MaxParticipants = activityDto.MaxParticipants
    };

    db.Activities.Add(activity);
    await db.SaveChangesAsync();
    
    return Results.Created($"/api/activities/{activity.Id}", new
    {
        activity.Id,
        activity.Type,
        activity.Title,
        activity.Description,
        activity.Date,
        activity.Time,
        activity.CreatedBy,
        activity.CreatedByName,
        Participants = activityDto.Participants,
        activity.MaxParticipants
    });
});

// Update activity
app.MapPut("/api/activities/{id}", async (string id, ActivityDto activityDto, ApplicationDbContext db) =>
{
    var activity = await db.Activities.FindAsync(id);
    if (activity is null) return Results.NotFound();

    activity.Type = activityDto.Type;
    activity.Title = activityDto.Title;
    activity.Description = activityDto.Description;
    activity.Date = activityDto.Date;
    activity.Time = activityDto.Time;
    activity.Participants = JsonSerializer.Serialize(activityDto.Participants ?? new string[0]);
    activity.MaxParticipants = activityDto.MaxParticipants;

    await db.SaveChangesAsync();
    
    return Results.Ok(new
    {
        activity.Id,
        activity.Type,
        activity.Title,
        activity.Description,
        activity.Date,
        activity.Time,
        activity.CreatedBy,
        activity.CreatedByName,
        Participants = activityDto.Participants,
        activity.MaxParticipants
    });
});

// Delete activity
app.MapDelete("/api/activities/{id}", async (string id, ApplicationDbContext db) =>
{
    var activity = await db.Activities.FindAsync(id);
    if (activity is null) return Results.NotFound();

    db.Activities.Remove(activity);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ==================== COMMENT ENDPOINTS ====================

// Get comments for an activity
app.MapGet("/api/activities/{activityId}/comments", async (string activityId, ApplicationDbContext db) =>
{
    return await db.Comments
        .Where(c => c.ActivityId == activityId)
        .OrderBy(c => c.Timestamp)
        .ToListAsync();
});

// Create comment
app.MapPost("/api/comments", async (Comment comment, ApplicationDbContext db) =>
{
    if (string.IsNullOrEmpty(comment.Id))
    {
        comment.Id = Guid.NewGuid().ToString();
    }

    if (string.IsNullOrEmpty(comment.Timestamp))
    {
        comment.Timestamp = DateTime.Now.ToString("o");
    }

    db.Comments.Add(comment);
    await db.SaveChangesAsync();
    return Results.Created($"/api/comments/{comment.Id}", comment);
});

// Delete comment
app.MapDelete("/api/comments/{id}", async (string id, ApplicationDbContext db) =>
{
    var comment = await db.Comments.FindAsync(id);
    if (comment is null) return Results.NotFound();

    db.Comments.Remove(comment);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

// DTO for Activity creation/update
public record ActivityDto(
    string? Id,
    string Type,
    string Title,
    string Description,
    string Date,
    string Time,
    string CreatedBy,
    string CreatedByName,
    string[]? Participants,
    int? MaxParticipants
);

