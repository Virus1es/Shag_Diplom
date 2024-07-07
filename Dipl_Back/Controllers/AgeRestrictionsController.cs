using Dipl_Back.Models;
using Dipl_Back.Models.Tables.Main;
using Dipl_Back.Models.Tables.References;
using Microsoft.AspNetCore.Mvc;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
// класс описывающий взаимодействия со справочниками
public class AgeRestrictionsController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    [HttpGet]
    public JsonResult GetAgeRestrictions() => new(_db.AgeRestrictions.ToList());

    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] string AgeRange)
    {
        try
        {
            AgeRestriction ageRestriction = new()
            {
                // имитируем изменение данных
                Id = id,
                AgeRange = AgeRange
            };

            // сохраняем изменения
            _db.AgeRestrictions.Update(ageRestriction);
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
    public string Put([FromForm] int id, [FromForm] string AgeRange)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.AgeRestrictions.Select(b => b.Id).Max();

            // создание нового Возростного ограничения
            AgeRestriction ageRestriction = new()
            {
                // имитируем изменение данных
                Id = id,
                AgeRange = AgeRange
            };

            // сохраняем изменения
            _db.AgeRestrictions.Add(ageRestriction);
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
            AgeRestriction ageRestriction = _db.AgeRestrictions.First(a => a.Id == id);

            // если нашли удаляем
            if (ageRestriction != null) _db.AgeRestrictions.Remove(ageRestriction);

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
