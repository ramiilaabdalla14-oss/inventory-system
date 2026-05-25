namespace InventoryBackend.DTOs;

public record DashboardStatsDto(
    int TotalProducts,
    int TotalSales,
    int LowStockCount,
    decimal TotalRevenue,
    decimal RevenueToday,
    IReadOnlyList<RecentSaleDto> RecentSales);

public record RecentSaleDto(int Id, string ProductName, int Quantity, decimal TotalPrice, DateTime SaleDate);

public record UploadResponseDto(string Url, string PublicId, string ResourceType);
