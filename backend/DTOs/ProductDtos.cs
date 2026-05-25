namespace InventoryBackend.DTOs;

public record ProductDto(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    int Quantity,
    string? ImageUrl,
    string? DocumentUrl);

public record CreateProductRequest(
    string Name,
    string? Description,
    decimal Price,
    int Quantity,
    string? ImageUrl,
    string? DocumentUrl);

public record UpdateProductRequest(
    string Name,
    string? Description,
    decimal Price,
    int Quantity,
    string? ImageUrl,
    string? DocumentUrl);
