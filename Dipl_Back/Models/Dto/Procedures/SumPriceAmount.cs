namespace Dipl_Back.Models.Dto.Procedures;


// класс описывающий представления для отчётов по покупкам и продажам:
// просмотр суммы и количества продаж по датам за определённый период
// просмотр суммы и количества закупок по датам за определённый период
public record SumPriceAmount(DateTime Date, int Price, int Amount);
