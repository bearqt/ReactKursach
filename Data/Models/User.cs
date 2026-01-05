using System.ComponentModel.DataAnnotations;

namespace ReactAdvancedAppQwen.Data.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        public string Login { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string Role { get; set; } = "User"; // "User" or "Admin"
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}