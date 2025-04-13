using Dipl_Back.Models;
using Microsoft.AspNetCore.Mvc;
using Dipl_Back.Models.Tables.Main;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
public class UserBookmarksController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    [HttpGet]
    public JsonResult Get() => new(_db.UserBookmarks.ToList());

    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] string UserEmail, [FromForm] int IdBook)
    {
        try
        {
            UserBookmark userBookmark = new()
            {
                // имитируем изменение данных
                Id = id,
                UserEmail = UserEmail,
                IdBook = IdBook
            };

            // сохраняем изменения
            _db.UserBookmarks.Update(userBookmark);
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
    public string Put([FromForm] int id, [FromForm] string UserEmail, [FromForm] int IdBook)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.UserBookmarks.Select(b => b.Id).Max();

            // создание нового Возростного ограничения
            UserBookmark userBookmark = new()
            {
                // имитируем изменение данных
                Id = id,
                UserEmail = UserEmail,
                IdBook = IdBook
            };

            // сохраняем изменения
            _db.UserBookmarks.Add(userBookmark);
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
            // найти нужное Возростного ограничения
            UserBookmark userBookmark = _db.UserBookmarks.First(a => a.Id == id);

            // если нашли удаляем
            if (userBookmark != null) _db.UserBookmarks.Remove(userBookmark);

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
