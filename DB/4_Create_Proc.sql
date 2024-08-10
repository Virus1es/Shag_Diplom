use Diploming_DB;
go

-- ������� ��� �������������� ������� ��� ����������� � �������� ��� �������������

-- ������ 1
-- �������� ����� � ���������� ������ �� ����� �� ����������� ������
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

-- ������ 2
-- �������� ����� � ���������� ������� �� ����� �� ����������� ������
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

-- ������ 3
-- ���������� ��������� ���� �� ���������� � ���������� ������
-- (���� ����� �� �� ����� - �� ������� ������� ������ ��������� ����: ����������� ����� ����, ������������ - �������)
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

-- ������ 4
-- ���������� ��������� ���� (��� ���������� �������� ����: ����������, ������ ������, �������� ������������)
-- ���� �� ������ �.�. ����� ����� ������������ ��� �������� "�������� �������������" 
-- �.�. ����� � ������ �������� ��������� �� �� ��������� ������ 
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

-- ������ 5
-- �������� ����: ����������(�) ������������ �����
create or alter proc SelectBooksByAmountSalesGenre
	@SelectGenre nvarchar(40)
as
	-- ���� �������� ������ ������� ������ ����� �������
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

exec SelectBooksByAmountSalesGenre '�����';
go


-- ������ 6
-- ������ ��������(���������� ��� �����) ����: ����������� �����
create or alter proc SelectBooksBestSallers
as
	-- ������� ��������� ������� ���� ��� ����������
	DROP TABLE IF EXISTS ##BestSellers;

	-- ���������� ���������� ������ ��� ���������
	declare @i int = 1, @maxI int = (select max(Id) from Genres), @genre nvarchar(50) = '';

	-- ������ ��������� �������, ������ ������� ���������� ��� ���������� ���������� ���������
	CREATE TABLE ##BestSellers(Title nvarchar(50), AuthorFullname nvarchar(50), GenreName nvarchar(50), Amount int);

	-- ��������������� ���������� �� ���� ������
	while @i < @maxI begin

		-- ���������� ������� ����
		set @genre = (select GenreName from Genres where Id = @i);

		-- ���� ���������� ����� ����� � ��������� ��� � �������
		insert ##BestSellers (Title, AuthorFullname, GenreName, Amount) exec SelectBooksByAmountSalesGenre @genre;

		-- �������������� �������
		set @i += 1;
	end

	-- ������� �������� ������� � ������������� �� ������
	select * from ##BestSellers;
go

exec SelectBooksBestSallers;
go

-- ������ 7
-- ������� ����������
create or alter proc SelectNewBooks
as
	select
		*
	from
		BooksWithFullPriceView
	where
		CreationYear = year(getdate());
go