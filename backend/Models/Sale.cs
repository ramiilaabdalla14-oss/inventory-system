namespace InventoryBackend.Models;

public class Sale
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;

    public Product Product { get; set; } = null!;
}