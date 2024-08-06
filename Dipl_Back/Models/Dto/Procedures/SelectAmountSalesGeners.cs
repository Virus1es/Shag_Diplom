namespace Dipl_Back.Models.Dto.Procedures;

// класс описывающий данные возвращаемые из базы процедурой
// количество проданных книг по категориям в опрделённый период
public record SelectAmountSalesGeners(string GenreName, int Amount);
