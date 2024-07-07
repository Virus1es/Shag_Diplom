using Dipl_Back.Models.Tables.References;

namespace Dipl_Back.Models.Tables.Main;

// класс описывающий запись в таблице Магазины
public partial class Store
{
    // ПК сущности
    public int Id { get; set; }

    // название магазина
    public string Name { get; set; } = null!;

    // город размещения
    public int IdCity { get; set; }

    // улица размещения
    public int IdStreet { get; set; }

    // номер дома размещения
    public string HouseNum { get; set; } = null!;


    #region Настройка внешних ключей

    // настройка внешнего ключа для связи с таблицей Города
    public virtual City IdCityNavigation { get; set; } = null!;

    // настройка внешнего ключа для связи с таблицей Улицы
    public virtual Street IdStreetNavigation { get; set; } = null!;

    #endregion
}
