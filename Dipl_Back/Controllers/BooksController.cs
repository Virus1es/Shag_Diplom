using Dipl_Back.Models;
using Dipl_Back.Models.Tables.Main;
using Microsoft.AspNetCore.Mvc;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
public class BooksController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    // получить список книг
    [HttpGet]
    public JsonResult Get() => new(_db.Books.ToList());

    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] string Title, [FromForm] int IdAuthor,
                       [FromForm] int IdGenre, [FromForm] int IdHouse, [FromForm] int IdAge, [FromForm] int Price, 
                       [FromForm] int CreationYear, [FromForm] double Rating)
    {
        try
        {
            Book book = new()
            {
                // имитируем изменение данных
                Id = id,
                Title = Title,
                IdAuthor = IdAuthor,
                IdGenre = IdGenre,
                IdHouse = IdHouse,
                IdAge = IdAge,
                Price = Price,
                CreationYear = CreationYear,
                Rating = Rating
            };

            // сохраняем изменения
            _db.Books.Update(book);
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
    public string Put([FromForm] int id, [FromForm] string Title, [FromForm] int IdAuthor,
                       [FromForm] int IdGenre, [FromForm] int IdHouse, [FromForm] int IdAge, [FromForm] int Price,
                       [FromForm] int CreationYear, [FromForm] double Rating)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.Books.Select(b => b.Id).Max();

            // создание новой книги
            Book book = new()
            {
                // имитируем изменение данных
                Id = id,
                Title = Title,
                IdAuthor = IdAuthor,
                IdGenre = IdGenre,
                IdHouse = IdHouse,
                IdAge = IdAge,
                Price = Price,
                CreationYear = CreationYear,
                Rating = Rating
            };

            // сохраняем изменения
            _db.Books.Add(book);
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
            Book book = _db.Books.First(b => b.Id == id);

            // если нашли удаляем
            if (book != null) _db.Books.Remove(book);

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
