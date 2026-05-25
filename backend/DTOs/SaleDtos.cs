namespace InventoryBackend.DTOs;

public record SaleDto(
    int Id,
    int ProductId,
    string ProductName,
    int Quantity,
    decimal TotalPrice,
    DateTime SaleDate);

public record CreateSaleRequest(int ProductId, int Quantity);

public record UpdateSaleRequest(int Quantity, decimal TotalPrice);
