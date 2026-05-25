using InventoryBackend.DTOs;
using InventoryBackend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InventoryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MediaController(ICloudinaryService cloudinaryService) : ControllerBase
{
  private static readonly HashSet<string> AllowedExtensions =
  [
      ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp",
      ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".txt"
  ];

    [HttpPost("upload")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<UploadResponseDto>> Upload(
        IFormFile file,
        [FromQuery] string folder = "inventory")
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "No file provided." });

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            return BadRequest(new { message = "File type not allowed." });

        await using var stream = file.OpenReadStream();
        var (url, publicId, resourceType) = await cloudinaryService.UploadAsync(
            stream, file.FileName, folder);

        return Ok(new UploadResponseDto(url, publicId, resourceType));
    }
}
