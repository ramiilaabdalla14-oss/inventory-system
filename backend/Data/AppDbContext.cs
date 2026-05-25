using Microsoft.EntityFrameworkCore;
using InventoryBackend.Models;

namespace InventoryBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Tables
        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Sale> Sales { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ========================
            // Product Configuration
            // ========================
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(p => p.Price)
                      .HasPrecision(18, 2); // FIX decimal warning

                entity.Property(p => p.Quantity)
                      .IsRequired();

                entity.Property(p => p.Description)
                      .HasMaxLength(500);

                entity.Property(p => p.ImageUrl)
                      .HasMaxLength(500);

                entity.Property(p => p.DocumentUrl)
                      .HasMaxLength(500);

                // Relation: Product -> Sales
                entity.HasMany(p => p.Sales)
                      .WithOne(s => s.Product)
                      .HasForeignKey(s => s.ProductId);
            });

            // ========================
            // Sale Configuration
            // ========================
            modelBuilder.Entity<Sale>(entity =>
            {
                entity.HasKey(s => s.Id);

                entity.Property(s => s.Quantity)
                      .IsRequired();

                entity.Property(s => s.TotalPrice)
                      .HasPrecision(18, 2); // FIX decimal warning

                entity.Property(s => s.SaleDate)
                      .HasDefaultValueSql("GETDATE()");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.Email)
                      .HasMaxLength(256);

                entity.Property(u => u.Name)
                      .HasMaxLength(100);

                entity.Property(u => u.Email)
                      .IsRequired();

                entity.Property(u => u.PasswordHash)
                      .IsRequired();

                entity.Property(u => u.Role)
                      .HasMaxLength(50)
                      .HasDefaultValue("Staff");

                entity.HasIndex(u => u.Email)
                      .IsUnique();
            });
        }
    }
}