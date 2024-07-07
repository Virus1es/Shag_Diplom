using Dipl_Back.Models.Tables.References;
using Dipl_Back.Models;
using Microsoft.AspNetCore.Mvc;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
public class PublishingHousesController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    [HttpGet]
    public JsonResult Get() => new(_db.PublishingHouses.ToList());


    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] string Name, [FromForm] string Phone, [FromForm] double AddPercent)
    {
        try
        {
            PublishingHouse publishingHouse = new()
            {
                // имитируем изменение данных
                Id = id,
                Name = Name,
                Phone = Phone,
                AddPercent = AddPercent
            };

            // сохраняем изменения
            _db.PublishingHouses.Update(publishingHouse);
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
    public string Put([FromForm] int id, [FromForm] string Name, [FromForm] string Phone, [FromForm] double AddPercent)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.PublishingHouses.Select(s => s.Id).Max();

            // создание нового издательства
            PublishingHouse publishingHouse = new()
            {
                // имитируем изменение данных
                Id = id,
                Name = Name,
                Phone = Phone,
                AddPercent = AddPercent
            };

            // сохраняем изменения
            _db.PublishingHouses.Add(publishingHouse);
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
            // найти нужное издательство
            PublishingHouse publishingHouse = _db.PublishingHouses.First(p => p.Id == id);

            // если нашли удаляем
            if (publishingHouse != null) _db.PublishingHouses.Remove(publishingHouse);

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
