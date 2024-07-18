namespace Dipl_Back.Models.Dto;

// запись описывающая данные получаемы из представления Книги на складе
public record BooksOnWarehouseView(int IdPubBook, string AuthorFullname, string Name, int RestAmount);
