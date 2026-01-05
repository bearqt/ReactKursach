using ReactAdvancedAppQwen.Data.Models;

namespace ReactAdvancedAppQwen.Data.Services
{
    public interface IBookingService
    {
        Task<IEnumerable<Booking>> GetAllBookingsAsync();
        Task<IEnumerable<Booking>> GetUserBookingsAsync(int userId);
        Task<IEnumerable<Booking>> GetRoomBookingsAsync(int roomId);
        Task<Booking?> GetBookingByIdAsync(int id);
        Task<Booking> CreateBookingAsync(Booking booking);
        Task<Booking?> UpdateBookingAsync(int id, Booking booking);
        Task<bool> DeleteBookingAsync(int id);
        Task<bool> IsRoomAvailableAsync(int roomId, DateTime startDate, DateTime endDate);
    }
}