use Diploming_DB;
go

DROP VIEW IF EXISTS dbo.BooksOnWarehouseView;
DROP VIEW IF EXISTS dbo.BooksWithFullPriceView;
go

-- создание представления Книги на складе
create or alter view BooksOnWarehouseView with schemabinding as
select
	IdPubBook
	, Books.Title
	, Books.BookImage
	, Authors.Surname + ' ' + SUBSTRING(Authors.FirstName,1,1) + '.' + 
				SUBSTRING(Authors.Patronymic,1,1) + '.'  as AuthorFullname
	, PublishingHouses.[Name]
	, isnull(sum(Purchases.Amount) - (select sum(Sales.Amount) 
									from dbo.Sales 
									where Sales.IdPubBook = Purchases.IdPubBook), 
			0) as RestAmount
from
	dbo.Purchases join (dbo.PubBooks join (dbo.Books join dbo.Authors on Books.IdAuthor = Authors.Id
													 join dbo.Genres  on Books.IdGenre = Genres.Id
													 join dbo.AgeRestrictions on Books.IdAge = AgeRestrictions.Id)
										on PubBooks.IdBook = Books.Id
									 join dbo.PublishingHouses on PubBooks.IdHouse = PublishingHouses.Id)
					on Purchases.IdPubBook = PubBooks.Id
group by
	IdPubBook, Books.Title, Books.BookImage, Authors.Surname, Authors.FirstName, Authors.Patronymic, PublishingHouses.[Name];
go

select * from BooksOnWarehouseView;
go

-- создание представления Книги с издаельствами с вычисляемым полем стоимость
create or alter view BooksWithFullPriceView with schemabinding as
select
	Books.Title
	, Books.BookImage
	, Authors.FirstName
	, Authors.Surname
	, Authors.Patronymic
	, Genres.GenreName
	, PublishingHouses.[Name]
	, AgeRestrictions.AgeRange
	, Books.Rating
	, Books.CreationYear
	, Books.BookDescription
	, Books.Price + Books.Price * (PublishingHouses.AddPercent / 100) as FullPrice
from
	dbo.PubBooks join (dbo.Books join dbo.Authors on Books.IdAuthor = Authors.Id
								 join dbo.Genres  on Books.IdGenre = Genres.Id
								 join dbo.AgeRestrictions on Books.IdAge = AgeRestrictions.Id)
					on PubBooks.IdBook = Books.Id
			 join dbo.PublishingHouses on PubBooks.IdHouse = PublishingHouses.Id;
go

select * from BooksWithFullPriceView;
go