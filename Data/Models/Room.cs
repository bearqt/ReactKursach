using System.ComponentModel.DataAnnotations;

namespace ReactAdvancedAppQwen.Data.Models
{
    public class Room
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Location { get; set; } = string.Empty;
        
        public int Capacity { get; set; }
        
        public string Description { get; set; } = string.Empty;
        
        public bool IsAvailable { get; set; } = true;
        
        public List<string> Amenities { get; set; } = new List<string>();
    }
}