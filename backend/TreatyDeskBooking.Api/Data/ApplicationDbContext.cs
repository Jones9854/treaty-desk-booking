using Microsoft.EntityFrameworkCore;
using TreatyDeskBooking.Api.Models;

namespace TreatyDeskBooking.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Activity> Activities { get; set; }
    public DbSet<Comment> Comments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Avatar).HasMaxLength(500);
        });

        // Configure Booking entity
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.UserName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Date).IsRequired().HasMaxLength(10);
            entity.Property(e => e.DeskNumber).IsRequired();
            
            entity.HasOne(e => e.User)
                .WithMany(u => u.Bookings)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasIndex(e => new { e.UserId, e.Date });
        });

        // Configure Activity entity
        modelBuilder.Entity<Activity>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Type).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Date).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Time).IsRequired().HasMaxLength(10);
            entity.Property(e => e.CreatedBy).IsRequired();
            entity.Property(e => e.CreatedByName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Participants).HasMaxLength(2000);
        });

        // Configure Comment entity
        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ActivityId).IsRequired();
            entity.Property(e => e.UserId).IsRequired();
            entity.Property(e => e.UserName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Text).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.Timestamp).IsRequired();
            
            entity.HasOne(e => e.Activity)
                .WithMany(a => a.Comments)
                .HasForeignKey(e => e.ActivityId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

