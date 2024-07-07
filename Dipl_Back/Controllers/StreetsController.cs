using Dipl_Back.Models.Tables.References;
using Dipl_Back.Models;
using Microsoft.AspNetCore.Mvc;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
public class StreetsController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    [HttpGet]
    public JsonResult Get() => new(_db.Streets.ToList());


    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] string StreetName)
    {
        try
        {
            Street street = new()
            {
                // имитируем изменение данных
                Id = id,
                StreetName = StreetName
            };

            // сохраняем изменения
            _db.Streets.Update(street);
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
    public string Put([FromForm] int id, [FromForm] string StreetName)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.Streets.Select(s => s.Id).Max();

            // создание новой улицы
            Street street = new()
            {
                // имитируем изменение данных
                Id = id,
                StreetName = StreetName
            };

            // сохраняем изменения
            _db.Streets.Add(street);
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
            // найти нужную улицу
            Street street = _db.Streets.First(s => s.Id == id);

            // если нашли удаляем
            if (street != null) _db.Streets.Remove(street);

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
