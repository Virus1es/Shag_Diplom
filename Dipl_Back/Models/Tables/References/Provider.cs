﻿using Dipl_Back.Models.Tables.Main;
using System.Text.Json.Serialization;

namespace Dipl_Back.Models.Tables.References;

// класс описывающий запись в таблице Поставщики
public partial class Provider
{
    // ПК сущности
    public int Id { get; set; }

    // название поставщика
    public string Name { get; set; } = null!;

    // контактный телефон
    public string Phone { get; set; } = null!;

    // настройка для внешнего ключа
    [JsonIgnore]
    public virtual ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();
}
