using InventoryBackend.Data;
using InventoryBackend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController(AppDbContext context) : ControllerBase
{
    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats()
    {
        var today = DateTime.UtcNow.Date;

        var totalProducts = await context.Products.CountAsync();
        var totalSales = await context.Sales.CountAsync();
        var lowStockCount = await context.Products.CountAsync(p => p.Quantity <= 5);
        var totalRevenue = await context.Sales.SumAsync(s => s.TotalPrice);
        var revenueToday = await context.Sales
            .Where(s => s.SaleDate >= today)
            .SumAsync(s => s.TotalPrice);

        var recentSales = await context.Sales
            .Include(s => s.Product)
            .OrderByDescending(s => s.SaleDate)
            .Take(5)
            .Select(s => new RecentSaleDto(
                s.Id, s.Product.Name, s.Quantity, s.TotalPrice, s.SaleDate))
            .ToListAsync();

        return Ok(new DashboardStatsDto(
            totalProducts,
            totalSales,
            lowStockCount,
            totalRevenue,
            revenueToday,
            recentSales));
    }
}
