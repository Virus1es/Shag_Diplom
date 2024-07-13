using Dipl_Back.Models;
using Dipl_Back.Models.Tables.Main;
using Microsoft.AspNetCore.Mvc;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
public class SalesController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    [HttpGet]
    public JsonResult Get() => new(_db.Sales.ToList());


    // POST-запрос (модификация данных на сервере)
    [HttpPost]
    public string Post([FromForm] int id, [FromForm] int IdPubBook, [FromForm] DateOnly SaleDate, 
                       [FromForm] int Amount, [FromForm] int SalePrice, [FromForm] int DeliverPrice)
    {
        try
        {
            Sale sale = new()
            {
                // имитируем изменение данных
                Id = id,
                IdPubBook = IdPubBook,
                SaleDate = SaleDate,
                Amount = Amount,
                SalePrice = SalePrice,
                DeliverPrice = DeliverPrice
            };

            // сохраняем изменения
            _db.Sales.Update(sale);
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
    public string Put([FromForm] int id, [FromForm] int IdPubBook, [FromForm] DateOnly SaleDate,
                      [FromForm] int Amount, [FromForm] int SalePrice, [FromForm] int DeliverPrice)
    {
        try
        {
            // находим максимальный индекс для вставки
            int maxid = _db.Sales.Select(b => b.Id).Max();

            // создание новой продажи
            Sale sale = new()
            {
                // имитируем изменение данных
                Id = id,
                IdPubBook = IdPubBook,
                SaleDate = SaleDate,
                Amount = Amount,
                SalePrice = SalePrice,
                DeliverPrice = DeliverPrice
            };

            // сохраняем изменения
            _db.Sales.Add(sale);
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
            // найти нужную продажу
            Sale sale = _db.Sales.First(s => s.Id == id);

            // если нашли удаляем
            if (sale != null) _db.Sales.Remove(sale);

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
