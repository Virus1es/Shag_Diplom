set noexec off
go

use master 
go

-- при отсутствии БД создать ее
if db_id('Diploming_DB') is null
begin
	create database Diploming_DB on (
	    name = Diploming_DB, 
		filename='C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\Diploming_DB.mdf'
	)
	log on (
		name = Diploming_DB_log, 
		filename='C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\Diploming_DB_log.ldf'
	);
end
else begin
print 'БД уже есть на сервере'
end;
go

use Diploming_DB;
go

-- удаление существующих вариантов таблиц
begin transaction;
print '';
print 'Удаление существующих таблиц:';
print '';

-- удалить старый вариант таблицы Sales(Продажи)
if OBJECT_ID('Sales') is not null begin
	drop table Sales;
	print 'Удалена таблица Sales';
end;

-- удалить старый вариант таблицы Purchases(Закупки)
if OBJECT_ID('Purchases') is not null begin
	drop table Purchases;
	print 'Удалена таблица Purchases';
end;

-- удалить старый вариант таблицы PubBooks(Публикации книг)
if OBJECT_ID('PubBooks') is not null begin
	drop table PubBooks;
	print 'Удалена таблица PubBooks';
end;

-- удалить старый вариант таблицы Books(Книги)
if OBJECT_ID('Books') is not null begin
	drop table Books;
	print 'Удалена таблица Books';
end;

-- удалить старый вариант таблицы Stores(Магазины)
if OBJECT_ID('Stores') is not null begin
	drop table Stores;
	print 'Удалена таблица Stores';
end;

-- удалить старый вариант таблицы Streets(Улицы)
if OBJECT_ID('Streets') is not null begin
	drop table Streets;
	print 'Удалена таблица Streets';
end;

-- удалить старый вариант таблицы Genres(Жанры)
if OBJECT_ID('Genres') is not null begin
	drop table Genres;
	print 'Удалена таблица Genres';
end;

-- удалить старый вариант таблицы Authors(Авторы)
if OBJECT_ID('Authors') is not null begin
	drop table Authors;
	print 'Удалена таблица Authors';
end;

-- удалить старый вариант таблицы PublishingHouses(Издательства)
if OBJECT_ID('PublishingHouses') is not null begin
	drop table PublishingHouses;
	print 'Удалена таблица PublishingHouses';
end;

-- удалить старый вариант таблицы Cities(Города)
if OBJECT_ID('Cities') is not null begin
	drop table Cities;
	print 'Удалена таблица Cities';
end;

-- удалить старый вариант таблицы Providers(Поставщики)
if OBJECT_ID('Providers') is not null begin
	drop table Providers;
	print 'Удалена таблица Providers';
end;

-- удалить старый вариант таблицы AgeRestrictions(Возрастные ограничения)
if OBJECT_ID('AgeRestrictions') is not null begin
	drop table AgeRestrictions;
	print 'Удалена таблица AgeRestrictions';
end;


-- Если осталась хотя бы одна таблица, откатить
-- транзакцию
if object_id('Genres') is not null  or 
   object_id('Providers') is not null  or 
   object_id('AgeRestrictions') is not null  or 
   object_id('Authors') is not null  or 
   object_id('PublishingHouses') is not null or
   object_id('Cities') is not null or
   object_id('Streets') is not null or
   object_id('Stores') is not null or
   object_id('Books') is not null or
   object_id('PubBooks') is not null or
   object_id('Purchases') is not null or
   object_id('Sales') is not null  begin  
   rollback transaction
   
   print ''
   print 'Не все таблицы удалены'
   print ''

   set noexec on;
end else begin
   commit transaction;
   
   print ''
   print 'Удаление таблиц завершено'
   print ''
end;


begin transaction

-- создание таблицы Возрастные ограничения
create table AgeRestrictions (
     Id        int          not null identity(1, 1),  -- для автоинкремента
	 AgeRange nvarchar(4)   not null,                 -- возрастное ограничение
	 
	 constraint AgeRestrictions_PK primary key (Id)
);
go

-- создание таблицы Жанры
create table Genres (
     Id        int          not null identity(1, 1),  -- для автоинкремента
	 GenreName nvarchar(50) not null,                 -- название жанра
	 
	 constraint Genres_PK primary key (Id)
);
go


-- создание таблицы Авторы
create table Authors (
     Id         int          not null identity(1, 1),  -- для автоинкремента
	 FirstName  nvarchar(50) not null,                 -- имя автора
	 Surname    nvarchar(50) not null,                 -- фамилия
	 Patronymic nvarchar(50) null,                     -- отчество
	 
	 constraint Authors_PK primary key (Id)
);
go


-- создание таблицы Издательства
create table PublishingHouses (
     Id         int          not null identity(1, 1),  -- для автоинкремента
	 [Name]     nvarchar(50) not null,                 -- название
	 Phone      nvarchar(15) not null,                 -- контактный номер
	 AddPercent float        not null,                 -- процент надбавки за издательство
	 
	 constraint PublishingHouses_PK primary key (Id),
	 -- процент надбавки должен лежать в пределах от 0 до 100
	 constraint PublishingHouses_AddPercent_check check (AddPercent between 0.0 and 100.0)
);
go

-- создание таблицы Поставщики
create table Providers (
     Id       int          not null identity(1, 1),  -- для автоинкремента
	 [Name]   nvarchar(50) not null,                 -- название
	 Phone    nvarchar(15) not null,                 -- контактный номер
	 
	 constraint Providers_PK primary key (Id)
);
go


-- создание таблицы Города
create table Cities (
     Id       int          not null identity(1, 1),  -- для автоинкремента
	 CityName nvarchar(50) not null,                 -- название города
	 
	 constraint Cities_PK primary key (Id)
);
go


-- создание таблицы Улицы
create table Streets (
     Id        int           not null identity(1, 1),  -- для автоинкремента
	 StreetName nvarchar(50) not null,                 -- название улицы
	 
	 constraint Streets_PK primary key (Id)
);
go


-- создание таблицы Магазины
create table Stores (
     Id       int          not null identity(1, 1) constraint Stores_PK primary key (Id),  -- для автоинкремента
	 [Name]   nvarchar(50) not null,                 -- название
	 IdCity   int          not null,                 -- город размещения
	 IdStreet int          not null,                 -- улица размещения
	 HouseNum nvarchar(10) not null,                 -- дом размещения
	 
	 --связь с таблицей Города
	 constraint FK_Stores_Cities foreign key(IdCity) references dbo.Cities(Id),
	 -- связь с таблицей Улицы
	 constraint FK_Stores_Streets foreign key(IdStreet) references dbo.Streets(Id)
);
go

-- создание таблицы Книги
create table Books ( 
     Id              int           not null identity(1, 1) constraint Books_PK primary key (Id), -- для автоинкремента
	 Title           nvarchar(100) not null,                 -- название
	 BookImage       nvarchar(255) not null,                 -- имя файла с обложкой книги
	 IdAuthor        int           not null,                 -- автор
	 IdGenre         int           not null,                 -- жанр
	 IdAge           int           not null,                 -- возрастное ограничение
	 Price           int           not null,                 -- цена книги
	 CreationYear    int           not null,                 -- год написания
	 AmountRatings   int           not null,                 -- число проголосовавших
	 Rating          float         not null,                 -- рейтинг
	 BookDescription nvarchar(500) not null,                 -- красткое описание книги

	 -- Цена книги не может быть меньше 0
	 constraint Books_Price_check check (Price > 0),
	 -- Число проголосовавших не может быть меньше 0
	 constraint Books_AmountRatings_check check (AmountRatings >= 0),
	 -- рейтинг долже находиться в диапозоне [0;5]
	 constraint Books_Rating_check check (Rating between 0.0 and 5.0),
	 -- год написания книги не может быть отрицательным и больше текущего года
	 constraint Books_CreationYear_check check (CreationYear between 0 and Year(getdate())),
	 -- связь с таблицей Авторы
	 constraint FK_Books_Authors foreign key(IdAuthor) references dbo.Authors(Id),
	 -- связь с таблицей Возрастные ограничения
	 constraint FK_Books_AgeRestrictions foreign key(IdAge) references dbo.AgeRestrictions(Id),
	 -- связь с таблицей Жанры
	 constraint FK_Books_Genres foreign key(IdGenre) references dbo.Genres(Id)
);
go

-- создание таблицы Издательства книг
create table PubBooks (
     Id      int not null identity(1, 1) constraint PubBooks_PK primary key (Id),  -- для автоинкремента
	 IdBook  int not null,                 -- книга
	 IdHouse int not null,                 -- издательство
	 
	 -- связь стаблицей Книги
	 constraint FK_PubBooks_Books foreign key(IdBook) references dbo.Books(Id),
	 -- связь с таблицей Издательства
	 constraint FK_PubBooks_PublishingHouses foreign key(IdHouse) references dbo.PublishingHouses(Id)
);
go


-- создание таблицы Закупки
create table Purchases (
     Id            int  not null identity(1, 1) constraint Purchases_PK primary key (Id), -- для автоинкремента
	 IdProvider    int  not null,         -- поставщик, у которого закупили книги
	 IdPubBook     int  not null,         -- какие книги закупили
	 PurchaseDate  date not null,         -- цена закупки
	 Amount        int  not null,         -- количество закупленных книг
	 PurchasePrice int  not null,         -- дата закупки
	 
	 -- дата закупки не может быть больше текущей
	 constraint Purchases_PurchaseDate_check check (PurchaseDate < getdate()),	 
	 -- цена закупки книг не может быть отрицательной
	 constraint Purchases_PurchasePrice_check check (PurchasePrice > 0),
	 -- количество закупленных книг не может быть отрицательным
	 constraint Purchases_Amount_check check (Amount > 0),
	 -- связь с таблицей Поставщики
	 constraint FK_Purchases_Providers foreign key(IdProvider) references dbo.Providers(Id),
	 -- связь с таблицей Книги с издательсвами
	 constraint FK_Purchases_PubBooks foreign key(IdPubBook) references dbo.PubBooks(Id)
);
go

-- создание таблицы Продажи
create table Sales ( 
     Id           int          not null identity(1, 1) constraint Sales_PK primary key (Id), -- для автоинкремента
	 IdPubBook    int  not null,        -- проданая книга
	 SaleDate     date not null,        -- дата продажи
	 Amount       int  not null,        -- количество проданных книг
	 SalePrice    int  not null,        -- цена продажи книг
	 DeliverPrice int  not null,        -- цена за доставку
	 
	 -- дата продажи книг не может быть больше текущей
	 constraint Sales_SaleDate_check check (SaleDate < getdate()),	 
	 -- количество проданных книг не может быть отрецательным
	 constraint Sales_Amount_check check (Amount > 0),
	 -- цена за доставку не может быть отрицательной
	 constraint Sales_DeliverPrice_check check (DeliverPrice > 0),
	 -- цена продажи книг не может быть отрицательной
	 constraint Sales_SalePrice_check check (SalePrice > 0),
	-- связь с таблицей Книги с издательствами
	 constraint FK_Sales_PubBooks foreign key(IdPubBook) references dbo.PubBooks(Id)
);
go


-- Если не создана хотя бы одна таблица, откатить
-- транзакцию
if object_id('Genres') is null  or 
   object_id('AgeRestrictions') is null  or 
   object_id('Providers') is null  or 
   object_id('Authors') is null  or 
   object_id('PublishingHouses') is null or
   object_id('Cities') is null or
   object_id('Streets') is null or
   object_id('Stores') is null or
   object_id('Books') is null or
   object_id('PubBooks') is null or
   object_id('Purchases') is null or
   object_id('Sales') is null  begin  
   rollback transaction;
   print '';
   print 'Не все таблицы созданы';
   print '';
   set noexec on;
end else
    commit transaction;

	
print '';
print 'Создание базы данных и таблиц выполнено';
print '';