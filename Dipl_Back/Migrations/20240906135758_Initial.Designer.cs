﻿// <auto-generated />
using System;
using Dipl_Back.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Dipl_Back.Migrations
{
    [DbContext(typeof(BooksContext))]
    [Migration("20240906135758_Initial")]
    partial class Initial
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Proxies:ChangeTracking", false)
                .HasAnnotation("Proxies:CheckEquality", false)
                .HasAnnotation("Proxies:LazyLoading", true)
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Dipl_Back.Models.Tables.Main.Book", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AmountRatings")
                        .HasColumnType("int");

                    b.Property<string>("BookDescription")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("BookImage")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<int>("CreationYear")
                        .HasColumnType("int");

                    b.Property<int>("IdAge")
                        .HasColumnType("int");

                    b.Property<int>("IdAuthor")
                        .HasColumnType("int");

                    b.Property<int>("IdGenre")
                        .HasColumnType("int");

                    b.Property<int>("Price")
                        .HasColumnType("int");

                    b.Property<double>("Rating")
                        .HasColumnType("float");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id")
                        .HasName("Books_PK");

                    b.HasIndex("IdAge");

                    b.HasIndex("IdAuthor");

                    b.HasIndex("IdGenre");

                    b.ToTable("Books");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.Main.PubBook", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("IdBook")
                        .HasColumnType("int");

                    b.Property<int>("IdHouse")
                        .HasColumnType("int");

                    b.HasKey("Id")
                        .HasName("PubBooks_PK");

                    b.HasIndex("IdBook");

                    b.HasIndex("IdHouse");

                    b.ToTable("PubBooks");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.Main.Purchase", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Amount")
                        .HasColumnType("int");

                    b.Property<int>("IdProvider")
                        .HasColumnType("int");

                    b.Property<int>("IdPubBook")
                        .HasColumnType("int");

                    b.Property<DateOnly>("PurchaseDate")
                        .HasColumnType("date");

                    b.Property<int>("PurchasePrice")
                        .HasColumnType("int");

                    b.HasKey("Id")
                        .HasName("Purchases_PK");

                    b.HasIndex("IdProvider");

                    b.HasIndex("IdPubBook");

                    b.ToTable("Purchases");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.Main.Sale", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Amount")
                        .HasColumnType("int");

                    b.Property<int>("DeliverPrice")
                        .HasColumnType("int");

                    b.Property<int>("IdPubBook")
                        .HasColumnType("int");

                    b.Property<DateOnly>("SaleDate")
                        .HasColumnType("date");

                    b.Property<int>("SalePrice")
                        .HasColumnType("int");

                    b.HasKey("Id")
                        .HasName("Sales_PK");

                    b.HasIndex("IdPubBook");

                    b.ToTable("Sales");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.Main.Store", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("HouseNum")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.Property<int>("IdCity")
                        .HasColumnType("int");

                    b.Property<int>("IdStreet")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id")
                        .HasName("Stores_PK");

                    b.HasIndex("IdCity");

                    b.HasIndex("IdStreet");

                    b.ToTable("Stores");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.AgeRestriction", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("AgeRange")
                        .IsRequired()
                        .HasMaxLength(4)
                        .HasColumnType("nvarchar(4)");

                    b.HasKey("Id")
                        .HasName("AgeRestrictions_PK");

                    b.ToTable("AgeRestrictions");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.Author", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Patronymic")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Surname")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id")
                        .HasName("Authors_PK");

                    b.ToTable("Authors");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.City", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("CityName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id")
                        .HasName("Cities_PK");

                    b.ToTable("Cities");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.Genre", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("GenreName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id")
                        .HasName("Genres_PK");

                    b.ToTable("Genres");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.Provider", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.HasKey("Id")
                        .HasName("Providers_PK");

                    b.ToTable("Providers");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.PublishingHouse", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<double>("AddPercent")
                        .HasColumnType("float");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.HasKey("Id")
                        .HasName("PublishingHouses_PK");

                    b.ToTable("PublishingHouses");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.Street", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("StreetName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id")
                        .HasName("Streets_PK");

                    b.ToTable("Streets");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("RoleId")
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.Main.Book", b =>
                {
                    b.HasOne("Dipl_Back.Models.Tables.References.AgeRestriction", "IdAgeNavigation")
                        .WithMany("Books")
                        .HasForeignKey("IdAge")
                        .IsRequired()
                        .HasConstraintName("FK_Books_AgeRestrictions");

                    b.HasOne("Dipl_Back.Models.Tables.References.Author", "IdAuthorNavigation")
                        .WithMany("Books")
                        .HasForeignKey("IdAuthor")
                        .IsRequired()
                        .HasConstraintName("FK_Books_Authors");

                    b.HasOne("Dipl_Back.Models.Tables.References.Genre", "IdGenreNavigation")
                        .WithMany("Books")
                        .HasForeignKey("IdGenre")
                        .IsRequired()
                        .HasConstraintName("FK_Books_Genres");

                    b.Navigation("IdAgeNavigation");

                    b.Navigation("IdAuthorNavigation");

                    b.Navigation("IdGenreNavigation");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.Main.PubBook", b =>
                {
                    b.HasOne("Dipl_Back.Models.Tables.Main.Book", "IdBookNavigation")
                        .WithMany("PubBooks")
                        .HasForeignKey("IdBook")
                        .IsRequired()
                        .HasConstraintName("FK_PubBooks_Books");

                    b.HasOne("Dipl_Back.Models.Tables.References.PublishingHouse", "IdHouseNavigation")
                        .WithMany("PubBooks")
                        .HasForeignKey("IdHouse")
                        .IsRequired()
                        .HasConstraintName("FK_PubBooks_PublishingHouses");

                    b.Navigation("IdBookNavigation");

                    b.Navigation("IdHouseNavigation");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.Main.Purchase", b =>
                {
                    b.HasOne("Dipl_Back.Models.Tables.References.Provider", "IdProviderNavigation")
                        .WithMany("Purchases")
                        .HasForeignKey("IdProvider")
                        .IsRequired()
                        .HasConstraintName("FK_Purchases_Providers");

                    b.HasOne("Dipl_Back.Models.Tables.Main.PubBook", "IdPubBookNavigation")
                        .WithMany("Purchases")
                        .HasForeignKey("IdPubBook")
                        .IsRequired()
                        .HasConstraintName("FK_Purchases_PubBooks");

                    b.Navigation("IdProviderNavigation");

                    b.Navigation("IdPubBookNavigation");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.Main.Sale", b =>
                {
                    b.HasOne("Dipl_Back.Models.Tables.Main.PubBook", "IdPubBookNavigation")
                        .WithMany("Sales")
                        .HasForeignKey("IdPubBook")
                        .IsRequired()
                        .HasConstraintName("FK_Sales_PubBooks");

                    b.Navigation("IdPubBookNavigation");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.Main.Store", b =>
                {
                    b.HasOne("Dipl_Back.Models.Tables.References.City", "IdCityNavigation")
                        .WithMany("Stores")
                        .HasForeignKey("IdCity")
                        .IsRequired()
                        .HasConstraintName("FK_Stores_Cities");

                    b.HasOne("Dipl_Back.Models.Tables.References.Street", "IdStreetNavigation")
                        .WithMany("Stores")
                        .HasForeignKey("IdStreet")
                        .IsRequired()
                        .HasConstraintName("FK_Stores_Streets");

                    b.Navigation("IdCityNavigation");

                    b.Navigation("IdStreetNavigation");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.Main.Book", b =>
                {
                    b.Navigation("PubBooks");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.Main.PubBook", b =>
                {
                    b.Navigation("Purchases");

                    b.Navigation("Sales");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.AgeRestriction", b =>
                {
                    b.Navigation("Books");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.Author", b =>
                {
                    b.Navigation("Books");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.City", b =>
                {
                    b.Navigation("Stores");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.Genre", b =>
                {
                    b.Navigation("Books");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.Provider", b =>
                {
                    b.Navigation("Purchases");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.PublishingHouse", b =>
                {
                    b.Navigation("PubBooks");
                });

            modelBuilder.Entity("Dipl_Back.Models.Tables.References.Street", b =>
                {
                    b.Navigation("Stores");
                });
#pragma warning restore 612, 618
        }
    }
}
