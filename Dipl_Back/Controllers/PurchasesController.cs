using Dipl_Back.Models;
using Dipl_Back.Models.Tables.Main;
using Microsoft.AspNetCore.Mvc;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
public class PurchasesController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    [HttpGet]
    public JsonResult Get() => new(_db.Purchases.ToList());


    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] int IdProvider, [FromForm] int IdPubBook, 
                       [FromForm] DateOnly PurchaseDate, [FromForm] int Amount, [FromForm] int PurchasePrice)
    {
        try
        {
            Purchase purchase = new()
            {
                // имитируем изменение данных
                Id = id,
                IdProvider = IdProvider,
                IdPubBook = IdPubBook,
                PurchaseDate = PurchaseDate,
                Amount = Amount,
                PurchasePrice = PurchasePrice
            };

            // сохраняем изменения
            _db.Purchases.Update(purchase);
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
    public string Put([FromForm] int id, [FromForm] int IdProvider, [FromForm] int IdPubBook,
                       [FromForm] DateOnly PurchaseDate, [FromForm] int Amount, [FromForm] int PurchasePrice)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.Purchases.Select(b => b.Id).Max();

            // создание новой закупки
            Purchase purchase = new()
            {
                // имитируем изменение данных
                Id = id,
                IdProvider = IdProvider,
                IdPubBook = IdPubBook,
                PurchaseDate = PurchaseDate,
                Amount = Amount,
                PurchasePrice = PurchasePrice
            };

            // сохраняем изменения
            _db.Purchases.Add(purchase);
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
            // найти нужную закупку
            Purchase purchase = _db.Purchases.First(p => p.Id == id);

            // если нашли удаляем
            if (purchase != null) _db.Purchases.Remove(purchase);

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
