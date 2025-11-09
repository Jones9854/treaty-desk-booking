namespace TreatyDeskBooking.Api.Models;

public class User
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    
    // Navigation property
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}

