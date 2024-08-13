namespace Dipl_Back.Models.Dto.Procedures;

// класс описывающий данные возвращаемые из базы процедурой
// подборка типа: Бестселлер(ы) определённого жанра
// полная подборка(включающая все жанры) типа: Бестселлеры жанра
public record SelectBooksByAmountSalesGenre(string Title, string BookImage, string AuthorFullname, int Amount);
