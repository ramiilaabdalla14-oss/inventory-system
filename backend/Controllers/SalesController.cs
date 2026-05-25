using InventoryBackend.Data;
using InventoryBackend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SalesController(AppDbContext context) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SaleDto>>> GetAll()
    {
        var sales = await context.Sales
            .Include(s => s.Product)
            .OrderByDescending(s => s.SaleDate)
            .Select(s => new SaleDto(
                s.Id, s.ProductId, s.Product.Name, s.Quantity, s.TotalPrice, s.SaleDate))
            .ToListAsync();

        return Ok(sales);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SaleDto>> GetById(int id)
    {
        var sale = await context.Sales
            .Include(s => s.Product)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (sale is null) return NotFound();
        return Ok(Map(sale));
    }

    [HttpPost]
    public async Task<ActionResult<SaleDto>> Create([FromBody] CreateSaleRequest request)
    {
        var product = await context.Products.FindAsync(request.ProductId);
        if (product is null) return BadRequest(new { message = "Product not found." });
        if (product.Quantity < request.Quantity)
            return BadRequest(new { message = "Insufficient stock." });

        var sale = new Models.Sale
        {
            ProductId = request.ProductId,
            Quantity = request.Quantity,
            TotalPrice = product.Price * request.Quantity,
            SaleDate = DateTime.UtcNow
        };

        product.Quantity -= request.Quantity;
        context.Sales.Add(sale);
        await context.SaveChangesAsync();

        await context.Entry(sale).Reference(s => s.Product).LoadAsync();
        return CreatedAtAction(nameof(GetById), new { id = sale.Id }, Map(sale));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<SaleDto>> Update(int id, [FromBody] UpdateSaleRequest request)
    {
        var sale = await context.Sales.Include(s => s.Product).FirstOrDefaultAsync(s => s.Id == id);
        if (sale is null) return NotFound();

        sale.Quantity = request.Quantity;
        sale.TotalPrice = request.TotalPrice;
        await context.SaveChangesAsync();
        return Ok(Map(sale));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sale = await context.Sales.Include(s => s.Product).FirstOrDefaultAsync(s => s.Id == id);
        if (sale is null) return NotFound();

        sale.Product.Quantity += sale.Quantity;
        context.Sales.Remove(sale);
        await context.SaveChangesAsync();
        return NoContent();
    }

    private static SaleDto Map(Models.Sale s) =>
        new(s.Id, s.ProductId, s.Product.Name, s.Quantity, s.TotalPrice, s.SaleDate);
}
