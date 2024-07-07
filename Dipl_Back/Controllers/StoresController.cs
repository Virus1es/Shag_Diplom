using Dipl_Back.Models;
using Dipl_Back.Models.Tables.Main;
using Microsoft.AspNetCore.Mvc;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
public class StoresController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    [HttpGet]
    public JsonResult Get() => new(_db.Stores.ToList());

    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] string Name, [FromForm] int IdCity,
                       [FromForm] int IdStreet, [FromForm] string HouseNum)
    {
        try
        {
            Store store = new()
            {
                // имитируем изменение данных
                Id = id,
                Name = Name,
                IdCity = IdCity,
                IdStreet = IdStreet,
                HouseNum = HouseNum
            };

            // сохраняем изменения
            _db.Stores.Update(store);
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
    public string Put([FromForm] int id, [FromForm] string Name, [FromForm] int IdCity,
                      [FromForm] int IdStreet, [FromForm] string HouseNum)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.Stores.Select(b => b.Id).Max();

            // создание нового магазина
            Store store = new()
            {
                // имитируем изменение данных
                Id = id,
                Name = Name,
                IdCity = IdCity,
                IdStreet = IdStreet,
                HouseNum = HouseNum
            };

            // сохраняем изменения
            _db.Stores.Add(store);
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
            // найти нужный магазин
            Store store = _db.Stores.First(s => s.Id == id);

            // если нашли удаляем
            if (store != null) _db.Stores.Remove(store);

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
