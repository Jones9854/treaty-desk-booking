namespace TreatyDeskBooking.Api.Models;

public class Activity
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // 'lunch' or 'after-work'
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;
    public string CreatedByName { get; set; } = string.Empty;
    public string Participants { get; set; } = string.Empty; // JSON array as string
    public int? MaxParticipants { get; set; }
    
    // Navigation property
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}

