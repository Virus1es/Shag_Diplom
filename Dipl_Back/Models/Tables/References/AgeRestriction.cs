﻿using Dipl_Back.Models.Tables.Main;
using System.Text.Json.Serialization;

namespace Dipl_Back.Models.Tables.References;

// класс описывающий запись в таблице Возрастные ограничения
public partial class AgeRestriction
{
    // ПК сущности
    public int Id { get; set; }

    // возрастное ограничение
    public string AgeRange { get; set; } = null!;

    // настройка для внешнего ключа
    [JsonIgnore]
    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
