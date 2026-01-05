using ReactAdvancedAppQwen.Data.Models;

namespace ReactAdvancedAppQwen.Data.Services
{
    public interface IUserService
    {
        Task<User?> ValidateUserAsync(string login, string password);
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByLoginAsync(string login);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> CreateUserAsync(User user);
    }
}