using Dipl_Back.Models;
using Dipl_Back.Models.Tables.References;
using Microsoft.AspNetCore.Mvc;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
public class CitiesController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    [HttpGet]
    public JsonResult Get() => new(_db.Cities.ToList());

    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] string CityName)
    {
        try
        {
            City city = new()
            {
                // имитируем изменение данных
                Id = id,
                CityName = CityName
            };

            // сохраняем изменения
            _db.Cities.Update(city);
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
    public string Put([FromForm] int id, [FromForm] string CityName)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.Cities.Select(c => c.Id).Max();

            // создание нового города
            City city = new()
            {
                // имитируем изменение данных
                Id = id,
                CityName = CityName
            };


            // сохраняем изменения
            _db.Cities.Add(city);
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
            // найти нужного автора
            Author author = _db.Authors.First(a => a.Id == id);

            // если нашли удаляем
            if (author != null) _db.Authors.Remove(author);

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
