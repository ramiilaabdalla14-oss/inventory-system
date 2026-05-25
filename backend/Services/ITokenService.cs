using InventoryBackend.Models;

namespace InventoryBackend.Services;

public interface ITokenService
{
    (string Token, DateTime ExpiresAt) CreateToken(User user);
}
