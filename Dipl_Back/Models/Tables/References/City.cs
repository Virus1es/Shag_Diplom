using Dipl_Back.Models.Tables.Main;

namespace Dipl_Back.Models.Tables.References;

// класс описывающий запись в таблице Города
public partial class City
{
    // ПК сущности
    public int Id { get; set; }

    // название города
    public string CityName { get; set; } = null!;

    // настройка внешнего ключа
    public virtual ICollection<Store> Stores { get; set; } = new List<Store>();
}
