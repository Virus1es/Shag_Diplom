using Dipl_Back.Models.Tables.Main;
using Dipl_Back.Models;
using Microsoft.AspNetCore.Mvc;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
public class PubBooksController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    // получить список книг
    [HttpGet]
    public JsonResult Get() => new(_db.PubBooks.ToList());

    // получить все издательства книги по Id
    [HttpPost]
    public JsonResult SearchPubsById([FromForm] int id) => 
        new(_db.PubBooks.Where(p => p.IdBook == id).ToList());

    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] int IdBook, [FromForm] int IdHouse)
    {
        try
        {
            PubBook pubBook = new()
            {
                // имитируем изменение данных
                Id = id,
                IdBook = IdBook,
                IdHouse = IdHouse
            };

            // сохраняем изменения
            _db.PubBooks.Update(pubBook);
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
    public string Put([FromForm] int id, [FromForm] int IdBook, [FromForm] int IdHouse)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.PubBooks.Select(b => b.Id).Max();

            // создание новой книги с издательством
            PubBook pubBook = new()
            {
                // имитируем изменение данных
                Id = id,
                IdBook = IdBook,
                IdHouse = IdHouse
            };

            // сохраняем изменения
            _db.PubBooks.Add(pubBook);
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
            // найти нужную книгу
            PubBook pubBook = _db.PubBooks.First(b => b.Id == id);

            // если нашли удаляем
            if (pubBook != null) _db.PubBooks.Remove(pubBook);

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
