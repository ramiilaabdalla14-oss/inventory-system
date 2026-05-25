using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace InventoryBackend.Services;

public class CloudinaryService(IConfiguration configuration) : ICloudinaryService
{
    private Cloudinary CreateClient()
    {
        var cloudName = configuration["Cloudinary:CloudName"];
        var apiKey = configuration["Cloudinary:ApiKey"];
        var apiSecret = configuration["Cloudinary:ApiSecret"];

        if (string.IsNullOrWhiteSpace(cloudName) ||
            string.IsNullOrWhiteSpace(apiKey) ||
            string.IsNullOrWhiteSpace(apiSecret))
        {
            throw new InvalidOperationException(
                "Cloudinary is not configured. Set Cloudinary:CloudName, ApiKey, and ApiSecret in appsettings or user secrets.");
        }

        return new Cloudinary(new Account(cloudName, apiKey, apiSecret));
    }

    public Task<(string Url, string PublicId, string ResourceType)> UploadAsync(
        Stream fileStream,
        string fileName,
        string folder,
        CancellationToken cancellationToken = default)
    {
        var cloudinary = CreateClient();
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        var isImage = extension is ".jpg" or ".jpeg" or ".png" or ".gif" or ".webp" or ".bmp";

        if (isImage)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(fileName, fileStream),
                Folder = folder,
                UseFilename = true,
                UniqueFilename = true,
                Overwrite = false
            };

            return UploadImageAsync(cloudinary, uploadParams, cancellationToken);
        }

        var rawParams = new RawUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = folder,
            UseFilename = true,
            UniqueFilename = true,
            Overwrite = false
        };

        return UploadRawAsync(cloudinary, rawParams, cancellationToken);
    }

    private static async Task<(string Url, string PublicId, string ResourceType)> UploadImageAsync(
        Cloudinary cloudinary,
        ImageUploadParams uploadParams,
        CancellationToken cancellationToken)
    {
        var result = await cloudinary.UploadAsync(uploadParams, cancellationToken);
        if (result.Error != null)
            throw new InvalidOperationException(result.Error.Message);

        return (result.SecureUrl.ToString(), result.PublicId, "image");
    }

    private static async Task<(string Url, string PublicId, string ResourceType)> UploadRawAsync(
        Cloudinary cloudinary,
        RawUploadParams uploadParams,
        CancellationToken cancellationToken)
    {
        var result = await Task.Run(() => cloudinary.Upload(uploadParams), cancellationToken);
        if (result.Error != null)
            throw new InvalidOperationException(result.Error.Message);

        return (result.SecureUrl.ToString(), result.PublicId, "raw");
    }

    public Task DeleteAsync(string publicId, string resourceType, CancellationToken cancellationToken = default)
    {
        var cloudinary = CreateClient();
        var param = new DeletionParams(publicId)
        {
            ResourceType = resourceType == "image"
                ? ResourceType.Image
                : ResourceType.Raw
        };

        return Task.Run(() => cloudinary.Destroy(param), cancellationToken);
    }
}
