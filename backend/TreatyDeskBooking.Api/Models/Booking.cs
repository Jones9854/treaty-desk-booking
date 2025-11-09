namespace TreatyDeskBooking.Api.Models;

public class Booking
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public int DeskNumber { get; set; }
    
    // Navigation property
    public User? User { get; set; }
}

