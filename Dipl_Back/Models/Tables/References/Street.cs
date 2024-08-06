using Dipl_Back.Models.Tables.Main;
using System.Text.Json.Serialization;

namespace Dipl_Back.Models.Tables.References;

// класс описывающий запись в таблице Улицы
public partial class Street
{
    // ПК сущности
    public int Id { get; set; }

    // название улицы
    public string StreetName { get; set; } = null!;

    // настройка для внешнего ключа
    [JsonIgnore]
    public virtual ICollection<Store> Stores { get; set; } = new List<Store>();
}
