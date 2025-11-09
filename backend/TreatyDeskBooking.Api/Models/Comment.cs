namespace TreatyDeskBooking.Api.Models;

public class Comment
{
    public string Id { get; set; } = string.Empty;
    public string ActivityId { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
    
    // Navigation property
    public Activity? Activity { get; set; }
}

