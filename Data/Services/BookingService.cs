using ReactAdvancedAppQwen.Data.Models;

namespace ReactAdvancedAppQwen.Data.Services
{
    public class BookingService : IBookingService
    {
        private static readonly List<Booking> _bookings = new List<Booking>
        {
            new Booking
            {
                Id = 1,
                RoomId = 1,
                UserId = 2,
                StartDate = DateTime.Today.AddHours(10),
                EndDate = DateTime.Today.AddHours(12),
                Title = "Team Meeting",
                Description = "Weekly team sync"
            },
            new Booking
            {
                Id = 2,
                RoomId = 2,
                UserId = 1,
                StartDate = DateTime.Today.AddDays(1).AddHours(14),
                EndDate = DateTime.Today.AddDays(1).AddHours(15),
                Title = "Client Presentation",
                Description = "Present new project proposal"
            }
        };
        private readonly IRoomService _roomService;
        private readonly IUserService _userService;
        
        public BookingService(IRoomService roomService, IUserService userService)
        {
            _roomService = roomService;
            _userService = userService;
        }
        
        public Task<IEnumerable<Booking>> GetAllBookingsAsync()
        {
            return Task.FromResult((IEnumerable<Booking>)_bookings);
        }
        
        public Task<IEnumerable<Booking>> GetUserBookingsAsync(int userId)
        {
            var userBookings = _bookings.Where(b => b.UserId == userId && b.IsActive);
            return Task.FromResult(userBookings);
        }
        
        public Task<IEnumerable<Booking>> GetRoomBookingsAsync(int roomId)
        {
            var roomBookings = _bookings.Where(b => b.RoomId == roomId && b.IsActive);
            return Task.FromResult(roomBookings);
        }
        
        public Task<Booking?> GetBookingByIdAsync(int id)
        {
            var booking = _bookings.FirstOrDefault(b => b.Id == id && b.IsActive);
            return Task.FromResult(booking);
        }
        
        public Task<Booking> CreateBookingAsync(Booking booking)
        {
            booking.Id = _bookings.Count > 0 ? _bookings.Max(b => b.Id) + 1 : 1;
            booking.CreatedAt = DateTime.UtcNow;
            booking.IsActive = true;
            _bookings.Add(booking);
            return Task.FromResult(booking);
        }
        
        public Task<Booking?> UpdateBookingAsync(int id, Booking booking)
        {
            var existingBooking = _bookings.FirstOrDefault(b => b.Id == id && b.IsActive);
            if (existingBooking != null)
            {
                existingBooking.RoomId = booking.RoomId;
                existingBooking.UserId = booking.UserId;
                existingBooking.StartDate = booking.StartDate;
                existingBooking.EndDate = booking.EndDate;
                existingBooking.Title = booking.Title;
                existingBooking.Description = booking.Description;
                return Task.FromResult(existingBooking);
            }
            return Task.FromResult<Booking?>(null);
        }
        
        public Task<bool> DeleteBookingAsync(int id)
        {
            var booking = _bookings.FirstOrDefault(b => b.Id == id && b.IsActive);
            if (booking != null)
            {
                booking.IsActive = false;
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }
        
        public async Task<bool> IsRoomAvailableAsync(int roomId, DateTime startDate, DateTime endDate)
        {
            var room = await _roomService.GetRoomByIdAsync(roomId);
            if (room == null)
            {
                return false;
            }
            
            var conflictingBookings = _bookings.Where(b => 
                b.RoomId == roomId && 
                b.IsActive && 
                ((b.StartDate < endDate) && (b.EndDate > startDate))
            );
            
            return !conflictingBookings.Any();
        }
    }
}