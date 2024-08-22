using Dipl_Back.Models;
using Dipl_Back.Models.Dto.Procedures;
using Dipl_Back.Models.Tables.References;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
public class AuthorsController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    [HttpGet]
    public JsonResult Get() => new(_db.Authors.ToList());

    [HttpGet]
    public JsonResult Popular() =>
        new(_db.Database
               .SqlQueryRaw<SelectAuthorByAmountBooksSales>("EXEC SelectAuthorByAmountBooksSales '2024-05-01', '2024-10-01'")
               .ToList());

    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] string FirstName,
                             [FromForm] string Surname, [FromForm] string? Patronymic)
    {
        try
        {
            Author author = new()
            {
                // имитируем изменение данных
                Id = id,
                FirstName = FirstName,
                Surname = Surname,
                Patronymic = Patronymic
            };

            // сохраняем изменения
            _db.Authors.Update(author);
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
    public string Put([FromForm] int id, [FromForm] string FirstName,
                            [FromForm] string Surname, [FromForm] string? Patronymic)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.Authors.Select(b => b.Id).Max();

            // создание нового автора
            Author author = new()
            {
                // имитируем изменение данных
                Id = id,
                FirstName = FirstName,
                Surname = Surname,
                Patronymic = Patronymic
            };

            // сохраняем изменения
            _db.Authors.Add(author);
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
