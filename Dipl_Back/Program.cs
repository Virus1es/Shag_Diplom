using Dipl_Back.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// ����������� EF ��� ������� - ���������� ������
// ������ ����������� ���������� � appsettings.json
string connection = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddAuthorization();

// Scaffold-DbContext "Server=DESKTOP-N88PL21;Database=Diploming_DB;Trusted_Connection=True;MultipleActiveResultSets=False;Encrypt=False;TrustServerCertificate=False;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models

builder.Services.AddDbContext<BooksContext>(
    options => options
        // ����������� lazy loading, ������� ���������� NuGet-����� Microsoft.EntityFrameworkCore.Proxies
        .UseLazyLoadingProxies()
        .UseSqlServer(connection));


//builder.Services.AddIdentity<IdentityUser, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = true)
//                .AddEntityFrameworkStores<BooksContext>();
builder.Services.AddIdentityCore<IdentityUser>(
    options => {
        options.SignIn.RequireConfirmedAccount = false;
        options.User.RequireUniqueEmail = true;
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 6;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireLowercase = false;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<BooksContext>();


builder.Services.AddIdentityApiEndpoints<IdentityUser>()
                .AddEntityFrameworkStores<BooksContext>();

//builder.Services.AddAuthorization();

//builder.Services.AddIdentityApiEndpoints<IdentityUser>()
//                .AddEntityFrameworkStores<BooksContext>();

// ���������� ������� CORS (Cross Origin Resource Sharing)
// ��� ���������� �������� � ������� �� ������ �������
// �.�. �� ���������� ����������, ��������� � ������ ��������
builder.Services.AddCors();

var app = builder.Build();


// ��������� CORS - ��������� ������������ ����� ��������� ��������
// � ��� ���� REST-��������
app.UseCors(b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// Configure the HTTP request pipeline.
app.UseAuthentication();

app.UseAuthorization();

app.MapIdentityApi<IdentityUser>();

app.MapControllers();

app.Run();
