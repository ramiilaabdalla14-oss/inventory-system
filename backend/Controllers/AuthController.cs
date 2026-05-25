using InventoryBackend.Data;
using InventoryBackend.DTOs;
using InventoryBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext context, ITokenService tokenService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        var (token, expiresAt) = tokenService.CreateToken(user);
        return Ok(new LoginResponse(token, user.Email, user.Name, user.Role, expiresAt));
    }
}
