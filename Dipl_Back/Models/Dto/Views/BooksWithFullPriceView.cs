namespace Dipl_Back.Models.Dto.Views;

// запись описывающая данные получаемы из представления Книги с издаельствами с вычисляемым полем стоимость
public record BooksWithFullPriceView(int Id, string Title, string BookImage, string FirstName, string Surname, 
                                     string Patronymic, string GenreName, string Name, string AgeRange, 
                                     double Rating, int CreationYear, double FullPrice);