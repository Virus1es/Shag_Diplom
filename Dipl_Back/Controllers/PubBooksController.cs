using Dipl_Back.Models.Tables.Main;
using Dipl_Back.Models;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

    // Определите класс для параметров
    public class PubBookData
    {
        public int IdBook { get; set; }
        public int IdHouse { get; set; }
    }

    public class PubBookEditData : PubBookData
    {
        public int Id {  get; set; }
    }

    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] PubBookEditData data)
    {
        if (data == null)
        {
            return BadRequest("Invalid data.");
        }
        try
        {
            PubBook pubBook = new()
            {
                // имитируем изменение данных
                Id = data.Id,
                IdBook = data.IdBook,
                IdHouse = data.IdHouse
            };

            // сохраняем изменения
            _db.PubBooks.Update(pubBook);
            await _db.SaveChangesAsync();

            return Ok("Book updated successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // PUT-запрос (создание данных на сервере)
    [HttpPut]
    public string Put([FromBody] PubBookData data)
    {
        try
        {
            // создание новой книги с издательством
            PubBook pubBook = new()
            {
                IdBook = data.IdBook,
                IdHouse = data.IdHouse
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

    public class IdForDelete
    {
        public int Id { get; set; }
    }

    // DELETE-запрос (удаление данных на сервере)
    [HttpDelete]
    public async Task<IActionResult> Delete([FromBody] IdForDelete data)
    {
        if (data.Id < 0)
        {
            return BadRequest("Invalid data.");
        }
        try
        {
            // найти нужную книгу
            PubBook pubBook = _db.PubBooks.First(b => b.Id == data.Id);

            // если нашли удаляем
            if (pubBook != null) _db.PubBooks.Remove(pubBook);

            // сохраняем изменения
            await _db.SaveChangesAsync();

            return Ok("Book updated successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
