namespace Dipl_Back.Models.Dto.Procedures;

// для получения данных с сервера от хранимой процедуры
// просмотр суммы и количества продаж по датам за текущий год
public record SumAndAmoutByMonth(string Month, int Price, int Amount);
