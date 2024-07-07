using Dipl_Back.Models;
using Dipl_Back.Models.Tables.References;
using Microsoft.AspNetCore.Mvc;

namespace Dipl_Back.Controllers;


[ApiController]
[Route("[controller]/{action}")]
public class GenresController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    [HttpGet]
    public JsonResult Get() => new(_db.Genres.ToList());


    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] string GenreName)
    {
        try
        {
            Genre genre = new()
            {
                // имитируем изменение данных
                Id = id,
                GenreName = GenreName
            };

            // сохраняем изменения
            _db.Genres.Update(genre);
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
    public string Put([FromForm] int id, [FromForm] string GenreName)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.Genres.Select(g => g.Id).Max();

            // создание нового жанра
            Genre genre = new()
            {
                // имитируем изменение данных
                Id = id,
                GenreName = GenreName
            };


            // сохраняем изменения
            _db.Genres.Add(genre);
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
            // найти нужный жанр
            Genre genre = _db.Genres.First(g => g.Id == id);

            // если нашли удаляем
            if (genre != null) _db.Genres.Remove(genre);

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
