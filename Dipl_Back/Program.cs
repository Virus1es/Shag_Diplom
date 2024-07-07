using Dipl_Back.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// подключение EF как сервиса - поставщика данных
// строку подключения определяем в appsettings.json
string connection = builder.Configuration.GetConnectionString("DefaultConnection");


// TODO: !!! посмотри в appsettings.json DefaultConnection !!!
// Scaffold-DbContext "Server=DESKTOP-N88PL21;Database=Diploming_DB;Trusted_Connection=True;MultipleActiveResultSets=False;Encrypt=False;TrustServerCertificate=False;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models

builder.Services.AddDbContext<BooksContext>(
    options => options
        // подключение lazy loading, сначала установить NuGet-пакет Microsoft.EntityFrameworkCore.Proxies
        .UseLazyLoadingProxies()
        .UseSqlServer(connection));

// добавление сервиса CORS (Cross Origin Resource Sharing)
// для разрешения запросов к серверу от других доменов
// т.е. от клиентских приложений, созданных в других проектах
builder.Services.AddCors();

var app = builder.Build();


// настройка CORS - разрешаем обрабатывать любые источники запросов
// и все виды REST-запросов
app.UseCors(b => b.AllowAnyOrigin().AllowAnyMethod());

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

app.Run();
