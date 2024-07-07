using Dipl_Back.Models.Tables.References;

namespace Dipl_Back.Models.Tables.Main;

// класс описывающий запись в таблице Книги
public partial class Book
{
    // ПК сущности
    public int Id { get; set; }

    // нзвание книги
    public string Title { get; set; } = null!;

    // автор книги
    public int IdAuthor { get; set; }

    // жанр книги
    public int IdGenre { get; set; }

    // издательство книги
    public int IdHouse { get; set; }

    // возрастное ограничение книги
    public int IdAge { get; set; }
    
    // цена книги
    public int Price { get; set; }

    // год написания
    public int CreationYear { get; set; }

    // рейтинг книги
    public double Rating { get; set; }

    #region Настройка внешних ключей

    // настройка внешнего ключа для связи с таблицей Возрастные ограничения
    public virtual AgeRestriction IdAgeNavigation { get; set; } = null!;

    // настройка внешнего ключа для связи с таблицей Авторы
    public virtual Author IdAuthorNavigation { get; set; } = null!;

    // настройка внешнего ключа для связи с таблицей Жанры
    public virtual Genre IdGenreNavigation { get; set; } = null!;

    // настройка внешнего ключа для связи с таблицей Издательства
    public virtual PublishingHouse IdHouseNavigation { get; set; } = null!;

    // настройка внешних ключей для таблиц, которые связываются с таблей Книги
    public virtual ICollection<Purchase> Purchases { get; set; } = new List<Purchase>();

    public virtual ICollection<Sale> Sales { get; set; } = new List<Sale>();

    #endregion
}
