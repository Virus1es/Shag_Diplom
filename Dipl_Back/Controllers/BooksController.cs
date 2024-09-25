using Dipl_Back.Models;
using Dipl_Back.Models.Dto.Procedures;
using Dipl_Back.Models.Tables.Main;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Drawing;
using System.Net;

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

    // поиск книг
    [HttpPost]
    public JsonResult Search([FromForm] string type, [FromForm] int? Id,
                             [FromForm] string? Title, [FromForm] string? Genre)
    {
        List<Book> rez = type switch
        {
            "id"    => _db.Books.Where(b => b.Id == Id).ToList(),
            "title" => _db.Books.Where(b => b.Title.Contains(Title)).ToList(),
            "genre" => _db.Books.Where(b => b.IdGenreNavigation.GenreName.Contains(Genre)).ToList(),
            _ => []
        };

        return new(rez);
    }

    // получение данных из процедуры SelectAmountBooksSales
    [HttpGet]
    public JsonResult Popular() =>
        new(_db.Database
               .SqlQueryRaw<SelectAmountBooksSales>("EXEC SelectAmountBooksSales '2023-01-01', '2024-10-01'")
               .ToList());

    [HttpPost]
    public async Task<IActionResult> UploadImage(IFormFile image)
    {
        if (image == null || image.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        var filePath = Path.Combine("D:/My folder/VS folder/Special/Дипломирование/dipl-front/src/img/books", image.FileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(stream);
        }

        return Ok(new { filePath });
    }


    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] string Title, [FromForm] string Image,
                      [FromForm] int IdAuthor, [FromForm] int IdGenre, [FromForm] int IdAge,
                      [FromForm] int Price, [FromForm] int CreationYear, [FromForm] string BookDescription)
    {
        try
        {
            Book book = new()
            {
                // имитируем изменение данных
                Id = id,
                Title = Title,
                BookImage = Image,
                IdAuthor = IdAuthor,
                IdGenre = IdGenre,
                IdAge = IdAge,
                Price = Price,
                CreationYear = CreationYear,
                BookDescription = BookDescription
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

    // изменение рейтинга книги
    [HttpPost]
    public string ChangeGrade([FromForm] int id, [FromForm] int grade)
    {
        try
        {
            // находим книгу которой поставили оценку
            Book book = _db.Books.Find(id) ?? throw new Exception("Книга не найдена");

            // увеличиваем количество проголосовавших
            book.AmountRatings++;

            // рассчитываем изминившуюся оценку:
            // находим сумму предыдущих оценок (умножая старую оценку на прошлое количество проголосовавших)
            // далее добавлем к сумме пришедшую оценку и делим на настоящее количество проголосовавших
            double freshRating = (book.Rating * (book.AmountRatings - 1) + grade) / book.AmountRatings;

            // обновляем рейтинг книги
            book.Rating = freshRating;

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

    // Определите класс для параметров
    public class BookData
    {
        public string Title { get; set; }
        public string Image { get; set; }
        public int IdAuthor { get; set; }
        public int IdGenre { get; set; }
        public int IdAge { get; set; }
        public int Price { get; set; }
        public int CreationYear { get; set; }
        public string BookDescription { get; set; }
    }

    // PUT-запрос (создание данных на сервере)
    [HttpPut]
    public async Task<string> Put([FromBody] BookData data)
    {
        try
        {
            // создание новой книги
            Book book = new()
            {
                Title = data.Title,
                BookImage = data.Image,
                IdAuthor = data.IdAuthor,
                IdGenre = data.IdGenre,
                IdAge = data.IdAge,
                Price = data.Price,
                CreationYear = data.CreationYear,
                Rating = 0.0,
                AmountRatings = 0,
                BookDescription = data.BookDescription
            };

            // сохраняем изменения
            _db.Books.Add(book);
            await _db.SaveChangesAsync();
            return _db.Books.ToList().Last().Id.ToString();
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
