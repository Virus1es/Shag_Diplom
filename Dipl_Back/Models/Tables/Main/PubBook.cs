using Dipl_Back.Models.Tables.References;
using System.Text.Json.Serialization;

namespace Dipl_Back.Models.Tables.Main;

// класс описывающий запись в таблице Книги с издательствами
public partial class PubBook
{
    // ПК сущности
    public int Id { get; set; }

    // книга
    public int IdBook { get; set; }

    // издательство книги
    public int IdHouse { get; set; }

    #region Настройка внешних ключей 

    // настройка внешнего ключа для связи с таблицей Книги
    public virtual Book IdBookNavigation { get; set; } = null!;

    // настройка внешнего ключа для связи с таблицей Издательства
    public virtual PublishingHouse IdHouseNavigation { get; set; } = null!;

    // настройка внешнего ключа для связи с таблицей Возрастные ограничения
    [JsonIgnore]
    public virtual ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();

    // настройка внешних ключей для таблиц, которые связываются с таблей Книги с издательствами
    [JsonIgnore]
    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();
    #endregion
}
