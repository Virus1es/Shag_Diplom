using Dipl_Back.Models.Tables.Main;

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

    // настройка для внешнего ключа
    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
