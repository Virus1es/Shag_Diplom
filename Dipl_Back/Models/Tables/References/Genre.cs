using Dipl_Back.Models.Tables.Main;
using System.Text.Json.Serialization;

namespace Dipl_Back.Models.Tables.References;

// класс описывающий запись в таблице Жанры
public partial class Genre
{
    // ПК сущности
    public int Id { get; set; }

    // название жанра
    public string GenreName { get; set; } = null!;

    // настройка для внешнего ключа
    [JsonIgnore]
    public virtual ICollection<Book> Books { get; set; } = new List<Book>();
}
