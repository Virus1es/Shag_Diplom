namespace Dipl_Back.Models.Dto.Procedures;

// класс описывающий данные возвращаемые из базы процедурой
// количество проданных книг (для составлени подборок типа: популярные, лидеры продаж, набирают популярность)
public record SelectAmountBooksSales(string Title, string BookImage, string AuthorFullname, string GenreName, int Amount);
