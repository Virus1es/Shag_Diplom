using Dipl_Back.Models.Tables.References;

namespace Dipl_Back.Models.Tables.Main;

// класс описывающий запись в таблице Закупки
public partial class Purchase
{
    // ПК сущности
    public int Id { get; set; }

    // поставщик 
    public int IdProvider { get; set; }

    // закупленная книга
    public int IdPubBook { get; set; }

    // дата закупки
    public DateOnly PurchaseDate { get; set; }

    // количество закупленных книг
    public int Amount { get; set; }

    // стоимость закупки
    public int PurchasePrice { get; set; }

    #region Настройка внешних ключей

    // настройка внешнего ключа для связи с таблицей Книги с издательствами
    public virtual PubBook IdPubBookNavigation { get; set; } = null!;

    // настройка внешнего ключа для связи с таблицей Поставщики
    public virtual Provider IdProviderNavigation { get; set; } = null!;

    #endregion
}
