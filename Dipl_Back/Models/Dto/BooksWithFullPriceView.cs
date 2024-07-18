namespace Dipl_Back.Models.Dto;

// запись описывающая данные получаемы из представления Книги с издаельствами с вычисляемым полем стоимость
public record BooksWithFullPriceView(string Title, string FirstName, string Surname, string Patronymic,
                                     string GenreName, string Name, string AgeRange, double Rating, double FullPrice);