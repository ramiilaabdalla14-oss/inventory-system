namespace InventoryBackend.DTOs;

public record UserDto(int Id, string Name, string Email, string Role);

public record UpdateUserRequest(string Name, string Email, string Role, string? Password);
