use Diploming_DB;
go

DROP VIEW IF EXISTS dbo.BooksOnWarehouseView;
DROP VIEW IF EXISTS dbo.BooksWithFullPriceView;
DROP VIEW IF EXISTS dbo.BooksView;
go

create or alter view BooksView with schemabinding as
select 
	Books.Id
	, Books.Title
	, Books.BookImage
	, Books.IdAuthor
	, Books.IdGenre
	, Books.IdAge
	, Books.Price
	, Books.CreationYear
	, Books.AmountRatings
	, Books.Rating
	, Books.BookDescription
from dbo.Books where Books.IsDeleted = 0;
go

-- создание представления Книги на складе
create or alter view BooksOnWarehouseView with schemabinding as
select
	IdPubBook
	, BooksView.Title
	, BooksView.BookImage
	, Authors.Surname + ' ' + SUBSTRING(Authors.FirstName,1,1) + '.' + 
				SUBSTRING(Authors.Patronymic,1,1) + '.'  as AuthorFullname
	, PublishingHouses.[Name]
	, isnull(sum(Purchases.Amount) - (select sum(Sales.Amount) 
									from dbo.Sales 
									where Sales.IdPubBook = Purchases.IdPubBook), 
			0) as RestAmount
from
	dbo.Purchases join (dbo.PubBooks join (dbo.BooksView join dbo.Authors on BooksView.IdAuthor = Authors.Id
													     join dbo.Genres  on BooksView.IdGenre = Genres.Id
													     join dbo.AgeRestrictions on BooksView.IdAge = AgeRestrictions.Id)
										on PubBooks.IdBook = BooksView.Id
									 join dbo.PublishingHouses on PubBooks.IdHouse = PublishingHouses.Id)
					on Purchases.IdPubBook = PubBooks.Id
group by
	IdPubBook, BooksView.Title, BooksView.BookImage, Authors.Surname, Authors.FirstName, Authors.Patronymic, PublishingHouses.[Name];
go

select * from BooksOnWarehouseView;
go

-- создание представления Книги с издаельствами с вычисляемым полем стоимость
create or alter view BooksWithFullPriceView with schemabinding as
select
	PubBooks.Id
	, BooksView.Title
	, BooksView.BookImage
	, Authors.FirstName
	, Authors.Surname
	, Authors.Patronymic
	, Genres.GenreName
	, PublishingHouses.[Name]
	, AgeRestrictions.AgeRange
	, BooksView.Rating
	, BooksView.CreationYear
	, BooksView.BookDescription
	, BooksView.Price + BooksView.Price * (PublishingHouses.AddPercent / 100) as FullPrice
from
	dbo.PubBooks join (dbo.BooksView join dbo.Authors on BooksView.IdAuthor = Authors.Id
								     join dbo.Genres  on BooksView.IdGenre = Genres.Id
								     join dbo.AgeRestrictions on BooksView.IdAge = AgeRestrictions.Id)
					on PubBooks.IdBook = BooksView.Id
			 join dbo.PublishingHouses on PubBooks.IdHouse = PublishingHouses.Id;
go

select * from BooksWithFullPriceView;
go
