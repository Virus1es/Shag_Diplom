using Dipl_Back.Models.Tables.Main;
using System.Text.Json.Serialization;

namespace Dipl_Back.Models.Tables.References;

// класс описывающий запись в таблице Издательства
public partial class PublishingHouse
{
    // ПК сущности
    public int Id { get; set; }

    // название издательства
    public string Name { get; set; } = null!;

    // контактный номер
    public string Phone { get; set; } = null!;

    // процент наценки за издательство
    public double AddPercent { get; set; }

    // настройка для внешнего ключа
    [JsonIgnore]
    public virtual ICollection<PubBook> PubBooks { get; set; } = new List<PubBook>();
}
