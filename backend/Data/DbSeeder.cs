using InventoryBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryBackend.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync())
            return;

        context.Users.Add(new User
        {
            Name = "Admin",
            Email = "admin@inventory.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = "Admin"
        });

        await context.SaveChangesAsync();
    }
}
