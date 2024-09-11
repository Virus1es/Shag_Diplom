using Dipl_Back.Models.Tables.Main;
using Dipl_Back.Models.Tables.References;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Dipl_Back.Models;

// класс описывающий базу данных
// создан подходом Database First
public partial class BooksContext : IdentityDbContext<IdentityUser>
{
    // конструктор контекста
    public BooksContext()
    {
    }

    // конструктор с параметром, испоьзуется в Program.cs
    public BooksContext(DbContextOptions<BooksContext> options)
        : base(options)
    {
    }

    #region Таблицы базы данных

    public DbSet<AgeRestriction> AgeRestrictions { get; set; }

    public DbSet<Author> Authors { get; set; }

    public DbSet<Book> Books { get; set; }

    public DbSet<City> Cities { get; set; }

    public DbSet<Genre> Genres { get; set; }

    public DbSet<Provider> Providers { get; set; }

    public DbSet<PubBook> PubBooks { get; set; }

    public DbSet<PublishingHouse> PublishingHouses { get; set; }

    public DbSet<Purchase> Purchases { get; set; }

    public DbSet<Sale> Sales { get; set; }

    public DbSet<Store> Stores { get; set; }

    public DbSet<Street> Streets { get; set; }

    #endregion

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-N88PL21;Database=Diploming_DB;Trusted_Connection=True;MultipleActiveResultSets=False;Encrypt=False;TrustServerCertificate=False;");

    // настройка модели на стадии создания
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AgeRestriction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("AgeRestrictions_PK");

            entity.Property(e => e.AgeRange).HasMaxLength(4);
        });

        modelBuilder.Entity<Author>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Authors_PK");

            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.Patronymic).HasMaxLength(50);
            entity.Property(e => e.Surname).HasMaxLength(50);
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Books_PK");

            entity.Property(e => e.Title).HasMaxLength(100);

            entity.Property(e => e.BookImage).HasMaxLength(255);

            entity.Property(e => e.BookDescription).HasMaxLength(500);

            entity.HasOne(d => d.IdAgeNavigation).WithMany(p => p.Books)
                .HasForeignKey(d => d.IdAge)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Books_AgeRestrictions");

            entity.HasOne(d => d.IdAuthorNavigation).WithMany(p => p.Books)
                .HasForeignKey(d => d.IdAuthor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Books_Authors");

            entity.HasOne(d => d.IdGenreNavigation).WithMany(p => p.Books)
                .HasForeignKey(d => d.IdGenre)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Books_Genres");
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Cities_PK");

            entity.Property(e => e.CityName).HasMaxLength(50);
        });

        modelBuilder.Entity<Genre>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Genres_PK");

            entity.Property(e => e.GenreName).HasMaxLength(50);
        });

        modelBuilder.Entity<Provider>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Providers_PK");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Phone).HasMaxLength(15);
        });

        modelBuilder.Entity<PubBook>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PubBooks_PK");

            entity.HasOne(d => d.IdBookNavigation).WithMany(p => p.PubBooks)
                .HasForeignKey(d => d.IdBook)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PubBooks_Books");

            entity.HasOne(d => d.IdHouseNavigation).WithMany(p => p.PubBooks)
                .HasForeignKey(d => d.IdHouse)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PubBooks_PublishingHouses");
        });

        modelBuilder.Entity<PublishingHouse>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PublishingHouses_PK");

            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Phone).HasMaxLength(15);
        });

        modelBuilder.Entity<Purchase>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Purchases_PK");

            entity.HasOne(d => d.IdProviderNavigation).WithMany(p => p.Purchases)
                .HasForeignKey(d => d.IdProvider)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Purchases_Providers");

            entity.HasOne(d => d.IdPubBookNavigation).WithMany(p => p.Purchases)
                .HasForeignKey(d => d.IdPubBook)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Purchases_PubBooks");
        });

        modelBuilder.Entity<Sale>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Sales_PK");

            entity.HasOne(d => d.IdPubBookNavigation).WithMany(p => p.Sales)
                .HasForeignKey(d => d.IdPubBook)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Sales_PubBooks");
        });

        modelBuilder.Entity<Store>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Stores_PK");

            entity.Property(e => e.HouseNum).HasMaxLength(10);
            entity.Property(e => e.Name).HasMaxLength(50);

            entity.HasOne(d => d.IdCityNavigation).WithMany(p => p.Stores)
                .HasForeignKey(d => d.IdCity)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Stores_Cities");

            entity.HasOne(d => d.IdStreetNavigation).WithMany(p => p.Stores)
                .HasForeignKey(d => d.IdStreet)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Stores_Streets");
        });

        modelBuilder.Entity<Street>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Streets_PK");

            entity.Property(e => e.StreetName).HasMaxLength(50);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
