using Dipl_Back.Models.Tables.Main;
using System.Text.Json.Serialization;

namespace Dipl_Back.Models.Tables.References;

// класс описывающий запись в таблице Авторы
public partial class Author
{
    // ПК сущности
    public int Id { get; set; }

    // имя автора
    public string FirstName { get; set; } = null!;

    // фамилия автора
    public string Surname { get; set; } = null!;

    // отчетство автора (при наличии)
    public string? Patronymic { get; set; }

    // настройка внешнего ключа
    [JsonIgnore]
    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
