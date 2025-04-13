using Dipl_Back.Models.Tables.References;

namespace Dipl_Back.Models.Tables.Main;

public class UserBookmark
{
    // ПК сущности
    public int Id { get; set; }

    // почта пользователя, создавшего закладку
    public string UserEmail { get; set; } = null!;

    // ПК книги 
    public int IdBook { get; set; }

    // настройка внешнего ключа для связи с таблицей Книги
    public virtual Book IdBookNavigation { get; set; } = null!;
}
