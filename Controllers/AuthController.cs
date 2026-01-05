using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using ReactAdvancedAppQwen.Data.Services;

namespace ReactAdvancedAppQwen.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userService.ValidateUserAsync(request.Login, request.Password);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }
            
            // Set authentication cookie
            var claims = new List<System.Security.Claims.Claim>
            {
                new System.Security.Claims.Claim("Id", user.Id.ToString()),
                new System.Security.Claims.Claim("Login", user.Login),
                new System.Security.Claims.Claim("Name", user.Name),
                new System.Security.Claims.Claim("Role", user.Role)
            };
            
            var identity = new System.Security.Claims.ClaimsIdentity(claims, "cookie");
            var principal = new System.Security.Claims.ClaimsPrincipal(identity);
            
            await HttpContext.SignInAsync("Cookies", principal);
            
            return Ok(new { 
                user.Id, 
                user.Login, 
                user.Name, 
                user.Role 
            });
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            // Check if user already exists
            var existingUser = await _userService.GetUserByLoginAsync(request.Login);
            if (existingUser != null)
            {
                return BadRequest(new { message = "User with this login already exists" });
            }
            
            var user = new Data.Models.User
            {
                Login = request.Login,
                Password = request.Password,
                Name = request.Name,
                Role = "User" // New users start as regular users
            };
            
            var createdUser = await _userService.CreateUserAsync(user);
            
            return Ok(new { 
                createdUser.Id, 
                createdUser.Login, 
                createdUser.Name, 
                createdUser.Role 
            });
        }
        
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync("Cookies");
            return Ok(new { message = "Logged out successfully" });
        }
        
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized(new { message = "Not authenticated" });
            }
            
            var userId = int.Parse(User.FindFirst("Id")?.Value ?? "0");
            var user = await _userService.GetUserByIdAsync(userId);
            
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            
            return Ok(new { 
                user.Id, 
                user.Login, 
                user.Name, 
                user.Role 
            });
        }
    }
    
    public class LoginRequest
    {
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
    
    public class RegisterRequest
    {
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}