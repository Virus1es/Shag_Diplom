using Castle.Core.Resource;
using Dipl_Back.Models;
using Dipl_Back.Models.Dto.Procedures;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Text.Json;

namespace Dipl_Back.Controllers;

[ApiController]
[Route("[controller]/{action}")]
public class ReportsController(BooksContext context) : Controller
{
    // соединение с БД
    // ссылка на базу данных
    private BooksContext _db = context;

    [HttpPost]
    public JsonResult SelectSalesByDateArea([FromForm] DateTime dateStart, [FromForm] DateTime dateEnd) =>
        new(_db.Database.ExecuteSqlRaw($"exec SelectSalesByDateArea '{dateStart:yyyy-MM-dd}', '{dateEnd:yyyy-MM-dd}'"));

    [HttpPost]
    public JsonResult SelectAmountSalesGeners([FromForm] string dateStart, [FromForm] string dateEnd)
    {
        DateTime start = DateTime.Parse(dateStart);
        DateTime end = DateTime.Parse(dateEnd);

        return new(_db.Database.SqlQuery<SelectAmountSalesGeners>($"exec SelectAmountSalesGeners {end}, {start}")
                               .ToList());
    }

    [HttpGet]
    public JsonResult SelectSalesByCurYear() =>
        new(_db.Database.SqlQuery<SumAndAmoutByMonth>($"exec SelectSalesByCurYear")
                        .ToList());

    [HttpGet]
    public JsonResult SelectPurchaseByCurYear() =>
        new(_db.Database.SqlQuery<SumAndAmoutByMonth>($"exec SelectPurchaseByCurYear")
                        .ToList());

}
