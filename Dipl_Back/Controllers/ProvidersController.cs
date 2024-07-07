using Dipl_Back.Models.Tables.References;
using Dipl_Back.Models;
using Microsoft.AspNetCore.Mvc;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
public class ProvidersController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    [HttpGet]
    public JsonResult Get() => new(_db.Genres.ToList());


    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] string Name, [FromForm] string Phone)
    {
        try
        {
            Provider provider = new()
            {
                // имитируем изменение данных
                Id = id,
                Name = Name,
                Phone = Phone
            };

            // сохраняем изменения
            _db.Providers.Update(provider);
            _db.SaveChanges();

            return "";
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }

    // PUT-запрос (создание данных на сервере)
    [HttpPut]
    public string Put([FromForm] int id, [FromForm] string Name, [FromForm] string Phone)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.Providers.Select(g => g.Id).Max();

            // создание нового поставщика
            Provider provider = new()
            {
                // имитируем изменение данных
                Id = id,
                Name = Name,
                Phone = Phone
            };

            // сохраняем изменения
            _db.Providers.Add(provider);
            _db.SaveChanges();
            return "";
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }


    // DELETE-запрос (удаление данных на сервере)
    [HttpDelete]
    public string Delete([FromForm] int id)
    {
        try
        {
            // найти нужного поставщика
            Provider provider = _db.Providers.First(p => p.Id == id);

            // если нашли удаляем
            if (provider != null) _db.Providers.Remove(provider);

            // сохраняем изменения
            _db.SaveChanges();

            return "";
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }
}
