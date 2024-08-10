﻿using Dipl_Back.Models;
using Dipl_Back.Models.Tables.Main;
using Microsoft.AspNetCore.Mvc;
using static System.Net.Mime.MediaTypeNames;

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
    public string Post([FromForm] int id, [FromForm] string Title, [FromForm] string Image,
                      [FromForm] int IdAuthor, [FromForm] int IdGenre, [FromForm] int IdAge,
                      [FromForm] int Price, [FromForm] int CreationYear)
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
                CreationYear = CreationYear
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
    public string Post([FromForm] int id, [FromForm] int grade)
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


    // PUT-запрос (создание данных на сервере)
    [HttpPut]
    public string Put([FromForm] int id, [FromForm] string Title, [FromForm] string Image, 
                      [FromForm] int IdAuthor, [FromForm] int IdGenre, [FromForm] int IdAge, 
                      [FromForm] int Price, [FromForm] int CreationYear)
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
                BookImage = Image,
                IdAuthor = IdAuthor,
                IdGenre = IdGenre,
                IdAge = IdAge,
                Price = Price,
                CreationYear = CreationYear,
                Rating = 0.0,
                AmountRatings = 0
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
