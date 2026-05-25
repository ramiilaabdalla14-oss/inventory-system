namespace InventoryBackend.Services;

public interface ICloudinaryService
{
    Task<(string Url, string PublicId, string ResourceType)> UploadAsync(
        Stream fileStream,
        string fileName,
        string folder,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(string publicId, string resourceType, CancellationToken cancellationToken = default);
}
