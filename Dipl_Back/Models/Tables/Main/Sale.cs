namespace Dipl_Back.Models.Tables.Main;

// класс описывающий запись в таблице Закупки
public partial class Sale
{
    // ПК сущности
    public int Id { get; set; }

    // проданная книга
    public int IdBook { get; set; }

    // дата продажи
    public DateOnly SaleDate { get; set; }

    // количество проданных книг
    public int Amount { get; set; }

    // цена продажи книги
    public int SalePrice { get; set; }

    // цена доставки
    public int DeliverPrice { get; set; }


    #region Настройка внешних ключей

    // настройка внешнего ключа для связи с таблицей Книги
    public virtual Book IdBookNavigation { get; set; } = null!;

    #endregion
}
