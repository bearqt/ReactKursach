using ReactAdvancedAppQwen.Data.Models;

namespace ReactAdvancedAppQwen.Data.Services
{
    public class UserService : IUserService
    {
        private static readonly List<User> _users = new List<User>
        {
            new User 
            { 
                Id = 1, 
                Login = "admin", 
                Password = "admin123", 
                Name = "Admin User", 
                Role = "Admin" 
            },
            new User 
            { 
                Id = 2, 
                Login = "user1", 
                Password = "user123", 
                Name = "Regular User", 
                Role = "User" 
            }
        };
        
        public Task<User?> ValidateUserAsync(string login, string password)
        {
            var user = _users.FirstOrDefault(u => u.Login == login && u.Password == password);
            return Task.FromResult(user);
        }
        
        public Task<User?> GetUserByIdAsync(int id)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            return Task.FromResult(user);
        }
        
        public Task<User?> GetUserByLoginAsync(string login)
        {
            var user = _users.FirstOrDefault(u => u.Login == login);
            return Task.FromResult(user);
        }
        
        public Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return Task.FromResult((IEnumerable<User>)_users);
        }
        
        public Task<User> CreateUserAsync(User user)
        {
            user.Id = _users.Count > 0 ? _users.Max(u => u.Id) + 1 : 1;
            user.CreatedAt = DateTime.UtcNow;
            _users.Add(user);
            return Task.FromResult(user);
        }
    }
}