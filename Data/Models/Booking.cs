using System.ComponentModel.DataAnnotations;

namespace ReactAdvancedAppQwen.Data.Models
{
    public class Booking
    {
        public int Id { get; set; }
        
        public int RoomId { get; set; }
        
        public Room? Room { get; set; }
        
        public int UserId { get; set; }
        
        public User? User { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
        
        public string Title { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
    }
}