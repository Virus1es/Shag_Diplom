use Diploming_DB;
go

-- Запросы для предоставления отчётов для сотрудников и подборок для пользователей

-- запрос 1
-- просмотр суммы и количества продаж по датам за определённый период
create or alter proc SelectSalesByDateArea
	@StartDate date,
	@EndDate date
as
	select
		SaleDate as [Date]
		, Sum(SalePrice + DeliverPrice) as Price
		, Sum(Amount) as Amount
	from
		Sales
	where
		SaleDate between @StartDate and @EndDate
	group by
		SaleDate;
go

exec SelectSalesByDateArea '2024-01-01', '2024-05-01';
go

-- запрос 2
-- просмотр суммы и количества закупок по датам за определённый период
create or alter proc SelectPurchasesByDateArea
	@StartDate date,
	@EndDate date
as
	select
		PurchaseDate as [Date]
		, Sum(PurchasePrice) as Price
		, Sum(Amount) as Amount
	from
		Purchases
	where
		PurchaseDate between @StartDate and @EndDate
	group by
		PurchaseDate;
go

exec SelectPurchasesByDateArea '2024-01-01', '2024-06-01';
go

-- запрос 3
-- количество проданных книг по категориям в опрделённый период
-- (если нужно за всё время - со стороны клиента приёдет начальная дата: минимальная какая есть, максимальная - текущая)
create or alter proc SelectAmountSalesGeners
	@StartDate date,
	@EndDate date
as
	select
		GenreName
		, sum(Amount) as Amount
	from
		Sales join (PubBooks join (Books join Genres on Books.IdGenre = Genres.Id)
								on PubBooks.IdBook = Books.Id)
				on Sales.IdPubBook = PubBooks.Id
	where
		SaleDate between @StartDate and @EndDate
	group by
		Genres.GenreName;
go

exec SelectAmountSalesGeners '2024-01-01', '2024-05-01';
go

-- запрос 4
-- количество проданных книг (для составлени подборок типа: популярные, лидеры продаж, набирают популярность)
-- дату не убираю т.к. можно будет использовать для подборки "набирают популятрность" 
-- т.е. книги с самыми высокими продажами на за последнюю неделю 
create or alter proc SelectAmountBooksSales
	@StartDate date,
	@EndDate date
as
	select
		Books.Title
		, Authors.Surname + ' ' + SUBSTRING(Authors.FirstName,1,1) + '.' + 
				SUBSTRING(Authors.Patronymic,1,1) + '.'  as AuthorFullname
		, Genres.GenreName
		, sum(Amount) as Amount
	from
		Sales join (PubBooks join (Books join Genres on Books.IdGenre = Genres.Id
										 join dbo.Authors on Books.IdAuthor = Authors.Id)
								on PubBooks.IdBook = Books.Id)
				on Sales.IdPubBook = PubBooks.Id
	where
		SaleDate between @StartDate and @EndDate
	group by
		Books.Title, Authors.Surname, Authors.FirstName, Authors.Patronymic, Genres.GenreName;
go

exec SelectAmountBooksSales '2023-01-01', '2024-10-01';
go

-- запрос 5
-- подборка типа: Бестселлер(ы) определённого жанра
create or alter proc SelectBooksByAmountSalesGenre
	@SelectGenre nvarchar(40)
as
	-- если передали пустое значени просто молча выходим
	if (@SelectGenre = '' or @SelectGenre IS NULL)
		return;

	select TOP (1)
		Books.Title
		, Authors.Surname + ' ' + SUBSTRING(Authors.FirstName,1,1) + '.' + 
				SUBSTRING(Authors.Patronymic,1,1) + '.'  as AuthorFullname
		, Genres.GenreName
		, sum(Amount) as Amount
		 from 
			Sales join (PubBooks join (Books join Genres on Books.IdGenre = Genres.Id
											 join dbo.Authors on Books.IdAuthor = Authors.Id)
									on PubBooks.IdBook = Books.Id)
					on Sales.IdPubBook = PubBooks.Id
		 where
			Genres.GenreName = @SelectGenre
		 group by 
			Books.Title, Authors.Surname, Authors.FirstName, Authors.Patronymic, Genres.GenreName
		 order by 
			Amount desc;
go

exec SelectBooksByAmountSalesGenre 'ужасы';
go


-- запрос 6
-- полная подборка(включающая все жанры) типа: Бестселлеры жанра
create or alter proc SelectBooksBestSallers
as
	-- удаляем временную таблицу если она существует
	DROP TABLE IF EXISTS ##BestSellers;

	-- определяем переменные нужные для процедуры
	declare @i int = 1, @maxI int = (select max(Id) from Genres), @genre nvarchar(50) = '';

	-- создаём верменную таблицу, задача которой объединить все результаты выполнения процедуры
	CREATE TABLE ##BestSellers(Title nvarchar(50), AuthorFullname nvarchar(50), GenreName nvarchar(50), Amount int);

	-- последовательно проходимся по всем жанрам
	while @i < @maxI begin

		-- определяем текущий жанр
		set @genre = (select GenreName from Genres where Id = @i);

		-- ищем бестселлер этого жанра и добавляем его в таблицу
		insert ##BestSellers (Title, AuthorFullname, GenreName, Amount) exec SelectBooksByAmountSalesGenre @genre;

		-- инкриментируем счётчик
		set @i += 1;
	end

	-- выводим итоговую таблицу с бестселлерами по жанрам
	select * from ##BestSellers;
go

exec SelectBooksBestSallers;
go

-- запрос 7
-- новинки литературы
create or alter proc SelectNewBooks
as
	select
		*
	from
		BooksWithFullPriceView
	where
		CreationYear = year(getdate());
go