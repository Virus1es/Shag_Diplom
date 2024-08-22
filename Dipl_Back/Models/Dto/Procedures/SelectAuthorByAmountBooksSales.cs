namespace Dipl_Back.Models.Dto.Procedures;

// класс описывающий данные возвращаемые из базы процедурой
// авторы недели (месяца, года, ...)
public record SelectAuthorByAmountBooksSales(string Surname, string FirstName, string Patronymic, int Amount);
