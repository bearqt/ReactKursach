using ReactAdvancedAppQwen.Data.Models;

namespace ReactAdvancedAppQwen.Data.Services
{
    public class RoomService : IRoomService
    {
        private static readonly List<Room> _rooms = new List<Room>
        {
            new Room
            {
                Id = 1,
                Name = "Conference Room A",
                Location = "Floor 1, Wing A",
                Capacity = 10,
                Description = "Large conference room with projector and whiteboard",
                Amenities = new List<string> { "Projector", "Whiteboard", "Video Conference", "Air Conditioning" }
            },
            new Room
            {
                Id = 2,
                Name = "Meeting Room B",
                Location = "Floor 2, Wing B",
                Capacity = 6,
                Description = "Medium-sized meeting room with comfortable seating",
                Amenities = new List<string> { "Whiteboard", "Video Conference", "Air Conditioning" }
            },
            new Room
            {
                Id = 3,
                Name = "Small Meeting Room",
                Location = "Floor 1, Wing C",
                Capacity = 4,
                Description = "Intimate meeting space for small teams",
                Amenities = new List<string> { "Whiteboard", "Air Conditioning" }
            },
            new Room
            {
                Id = 4,
                Name = "Executive Boardroom",
                Location = "Floor 3, Wing A",
                Capacity = 12,
                Description = "Premium boardroom for executive meetings",
                Amenities = new List<string> { "Projector", "Video Conference", "Air Conditioning", "Coffee Machine" }
            }
        };
        
        public Task<IEnumerable<Room>> GetAllRoomsAsync()
        {
            return Task.FromResult((IEnumerable<Room>)_rooms);
        }
        
        public Task<Room?> GetRoomByIdAsync(int id)
        {
            var room = _rooms.FirstOrDefault(r => r.Id == id);
            return Task.FromResult(room);
        }
        
        public Task<Room> CreateRoomAsync(Room room)
        {
            room.Id = _rooms.Count > 0 ? _rooms.Max(r => r.Id) + 1 : 1;
            _rooms.Add(room);
            return Task.FromResult(room);
        }
        
        public Task<Room?> UpdateRoomAsync(int id, Room room)
        {
            var existingRoom = _rooms.FirstOrDefault(r => r.Id == id);
            if (existingRoom != null)
            {
                existingRoom.Name = room.Name;
                existingRoom.Location = room.Location;
                existingRoom.Capacity = room.Capacity;
                existingRoom.Description = room.Description;
                existingRoom.Amenities = room.Amenities;
                existingRoom.IsAvailable = room.IsAvailable;
                return Task.FromResult(existingRoom);
            }
            return Task.FromResult<Room?>(null);
        }
        
        public Task<bool> DeleteRoomAsync(int id)
        {
            var room = _rooms.FirstOrDefault(r => r.Id == id);
            if (room != null)
            {
                _rooms.Remove(room);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }
        
        public Task<IEnumerable<Room>> GetAvailableRoomsAsync(DateTime startDate, DateTime endDate)
        {
            return Task.FromResult((IEnumerable<Room>)_rooms.Where(r => r.IsAvailable));
        }
    }
}