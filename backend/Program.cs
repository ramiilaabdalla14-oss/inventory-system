using System.Text;
using InventoryBackend.Data;
using InventoryBackend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

static string? ToPostgresConnectionString(string databaseUrl)
{
    if (!databaseUrl.StartsWith("postgres", StringComparison.OrdinalIgnoreCase))
        return databaseUrl;

    var uri = new Uri(databaseUrl);
    var userInfo = uri.UserInfo.Split(':', 2);
    var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
    return $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={password};SSL Mode=Require;Trust Server Certificate=true";
}

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? ToPostgresConnectionString(Environment.GetEnvironmentVariable("DATABASE_URL") ?? "");

var usePostgres = builder.Configuration["Database:Provider"] == "PostgreSQL"
    || (connectionString?.Contains("Host=", StringComparison.OrdinalIgnoreCase) ?? false)
    || !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DATABASE_URL"));

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (usePostgres)
        options.UseNpgsql(connectionString);
    else
        options.UseSqlServer(connectionString);
});

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key is not configured.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

var corsFromConfig = builder.Configuration.GetSection("Cors:Origins").Get<string[]>();
var corsOrigins = corsFromConfig is { Length: > 0 }
    ? corsFromConfig
    : ["http://localhost:5173", "http://localhost:3000"];

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
        policy.WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (usePostgres)
        await db.Database.EnsureCreatedAsync();
    else
        await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
