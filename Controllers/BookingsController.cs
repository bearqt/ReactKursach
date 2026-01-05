using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactAdvancedAppQwen.Data.Services;

namespace ReactAdvancedAppQwen.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IRoomService _roomService;
        private readonly IUserService _userService;
        
        public BookingsController(IBookingService bookingService, IRoomService roomService, IUserService userService)
        {
            _bookingService = bookingService;
            _roomService = roomService;
            _userService = userService;
        }
        
        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);
        }
        
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserBookings(int userId)
        {
            var bookings = await _bookingService.GetUserBookingsAsync(userId);
            return Ok(bookings);
        }
        
        [HttpGet("room/{roomId}")]
        public async Task<IActionResult> GetRoomBookings(int roomId)
        {
            var bookings = await _bookingService.GetRoomBookingsAsync(roomId);
            return Ok(bookings);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBooking(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }
            return Ok(booking);
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] Data.Models.Booking booking)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Check if user exists
            var user = await _userService.GetUserByIdAsync(booking.UserId);
            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }
            
            // Check if room exists
            var room = await _roomService.GetRoomByIdAsync(booking.RoomId);
            if (room == null)
            {
                return BadRequest(new { message = "Room not found" });
            }
            
            // Check if room is available
            var isAvailable = await _bookingService.IsRoomAvailableAsync(booking.RoomId, booking.StartDate, booking.EndDate);
            if (!isAvailable)
            {
                return BadRequest(new { message = "Room is not available for the selected time period" });
            }
            
            var createdBooking = await _bookingService.CreateBookingAsync(booking);
            return CreatedAtAction(nameof(GetBooking), new { id = createdBooking.Id }, createdBooking);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, [FromBody] Data.Models.Booking booking)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Check if the booking exists
            var existingBooking = await _bookingService.GetBookingByIdAsync(id);
            if (existingBooking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }
            
            // Only allow the user who created the booking to update it, or an admin
            var currentUserId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
            var currentUserRole = User.FindFirst("Role")?.Value ?? "User";
            
            if (currentUserRole != "Admin" && existingBooking.UserId != currentUserId)
            {
                return Forbid();
            }
            
            // Check if room is available for the new time period
            var isAvailable = await _bookingService.IsRoomAvailableAsync(booking.RoomId, booking.StartDate, booking.EndDate);
            if (!isAvailable && (existingBooking.StartDate != booking.StartDate || existingBooking.EndDate != booking.EndDate))
            {
                return BadRequest(new { message = "Room is not available for the selected time period" });
            }
            
            var updatedBooking = await _bookingService.UpdateBookingAsync(id, booking);
            if (updatedBooking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }
            
            return Ok(updatedBooking);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            // Check if the booking exists
            var existingBooking = await _bookingService.GetBookingByIdAsync(id);
            if (existingBooking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }
            
            // Only allow the user who created the booking to delete it, or an admin
            var currentUserId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
            var currentUserRole = User.FindFirst("Role")?.Value ?? "User";
            
            if (currentUserRole != "Admin" && existingBooking.UserId != currentUserId)
            {
                return Forbid();
            }
            
            var result = await _bookingService.DeleteBookingAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Booking not found" });
            }
            
            return Ok(new { message = "Booking deleted successfully" });
        }
    }
}