﻿using Dipl_Back.Models.Tables.References;
using System.Text.Json.Serialization;

namespace Dipl_Back.Models.Tables.Main;

// класс описывающий запись в таблице Книги
public partial class Book
{
    // ПК сущности
    public int Id { get; set; }

    // название книги
    public string Title { get; set; } = null!;

    // имя файла с картинкой обложки книги
    public string BookImage { get; set; } = null!;

    // автор книги
    public int IdAuthor { get; set; }

    // жанр книги
    public int IdGenre { get; set; }

    // возрастное ограничение книги
    public int IdAge { get; set; }
    
    // цена книги
    public int Price { get; set; }

    // год написания
    public int CreationYear { get; set; }
    
    // год написания
    public int AmountRatings { get; set; }

    // рейтинг книги
    public double Rating { get; set; }

    // красткое описание книги
    public string BookDescription { get; set; } = null!;

    #region Настройка внешних ключей

    // настройка внешнего ключа для связи с таблицей Возрастные ограничения
    public virtual AgeRestriction IdAgeNavigation { get; set; } = null!;

    // настройка внешнего ключа для связи с таблицей Авторы
    public virtual Author IdAuthorNavigation { get; set; } = null!;

    // настройка внешнего ключа для связи с таблицей Жанры
    public virtual Genre IdGenreNavigation { get; set; } = null!;

    // настройка внешних ключей для таблиц, которые связываются с таблей Книги
    [JsonIgnore]
    public virtual ICollection<PubBook> PubBooks { get; set; } = new List<PubBook>();

    #endregion
}
