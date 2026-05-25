using InventoryBackend.Data;
using InventoryBackend.DTOs;
using InventoryBackend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
    {
        var users = await context.Users
            .OrderBy(u => u.Name)
            .Select(u => new UserDto(u.Id, u.Name, u.Email, u.Role))
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost]
    public async Task<ActionResult<UserDto>> Create([FromBody] RegisterUserRequest request)
    {
        if (await context.Users.AnyAsync(u => u.Email == request.Email))
            return Conflict(new { message = "Email already exists." });

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = string.IsNullOrWhiteSpace(request.Role) ? "Staff" : request.Role
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new UserDto(user.Id, user.Name, user.Email, user.Role));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<UserDto>> Update(int id, [FromBody] UpdateUserRequest request)
    {
        var user = await context.Users.FindAsync(id);
        if (user is null) return NotFound();

        if (await context.Users.AnyAsync(u => u.Email == request.Email && u.Id != id))
            return Conflict(new { message = "Email already exists." });

        user.Name = request.Name;
        user.Email = request.Email;
        user.Role = request.Role;
        if (!string.IsNullOrWhiteSpace(request.Password))
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        await context.SaveChangesAsync();
        return Ok(new UserDto(user.Id, user.Name, user.Email, user.Role));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await context.Users.FindAsync(id);
        if (user is null) return NotFound();

        context.Users.Remove(user);
        await context.SaveChangesAsync();
        return NoContent();
    }
}
