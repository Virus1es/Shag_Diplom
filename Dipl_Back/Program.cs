using Dipl_Back.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// ����������� EF ��� ������� - ���������� ������
// ������ ����������� ���������� � appsettings.json
string connection = builder.Configuration.GetConnectionString("DefaultConnection");


// TODO: !!! �������� � appsettings.json DefaultConnection !!!
// Scaffold-DbContext "Server=DESKTOP-N88PL21;Database=Diploming_DB;Trusted_Connection=True;MultipleActiveResultSets=False;Encrypt=False;TrustServerCertificate=False;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models

builder.Services.AddDbContext<BooksContext>(
    options => options
        // ����������� lazy loading, ������� ���������� NuGet-����� Microsoft.EntityFrameworkCore.Proxies
        .UseLazyLoadingProxies()
        .UseSqlServer(connection));

// ���������� ������� CORS (Cross Origin Resource Sharing)
// ��� ���������� �������� � ������� �� ������ �������
// �.�. �� ���������� ����������, ��������� � ������ ��������
builder.Services.AddCors();

var app = builder.Build();


// ��������� CORS - ��������� ������������ ����� ��������� ��������
// � ��� ���� REST-��������
app.UseCors(b => b.AllowAnyOrigin().AllowAnyMethod());

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

app.Run();
