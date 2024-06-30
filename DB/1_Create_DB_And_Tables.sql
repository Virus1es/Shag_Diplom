set noexec off
go

use master 
go

-- ��� ���������� �� ������� ��
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
print '�� ��� ���� �� �������'
end;
go

use Diploming_DB;
go

-- �������� ������������ ��������� ������
begin transaction;
print '';
print '�������� ������������ ������:';
print '';

-- ������� ������ ������� ������� Sales(�������)
if OBJECT_ID('Sales') is not null begin
	drop table Sales;
	print '������� ������� Sales';
end;

-- ������� ������ ������� ������� Purchases(�������)
if OBJECT_ID('Purchases') is not null begin
	drop table Purchases;
	print '������� ������� Purchases';
end;

-- ������� ������ ������� ������� Books(�����)
if OBJECT_ID('Books') is not null begin
	drop table Books;
	print '������� ������� Books';
end;

-- ������� ������ ������� ������� Stores(��������)
if OBJECT_ID('Stores') is not null begin
	drop table Stores;
	print '������� ������� Stores';
end;

-- ������� ������ ������� ������� Streets(�����)
if OBJECT_ID('Streets') is not null begin
	drop table Streets;
	print '������� ������� Streets';
end;

-- ������� ������ ������� ������� Genres(�����)
if OBJECT_ID('Genres') is not null begin
	drop table Genres;
	print '������� ������� Genres';
end;

-- ������� ������ ������� ������� Authors(������)
if OBJECT_ID('Authors') is not null begin
	drop table Authors;
	print '������� ������� Authors';
end;

-- ������� ������ ������� ������� PublishingHouses(������������)
if OBJECT_ID('PublishingHouses') is not null begin
	drop table PublishingHouses;
	print '������� ������� PublishingHouses';
end;

-- ������� ������ ������� ������� Cities(������)
if OBJECT_ID('Cities') is not null begin
	drop table Cities;
	print '������� ������� Cities';
end;

-- ������� ������ ������� ������� AgeRestrictions(���������� �����������)
if OBJECT_ID('AgeRestrictions') is not null begin
	drop table AgeRestrictions;
	print '������� ������� AgeRestrictions';
end;


-- ���� �������� ���� �� ���� �������, ��������
-- ����������
if object_id('Genres') is not null  or 
   object_id('AgeRestrictions') is not null  or 
   object_id('Authors') is not null  or 
   object_id('PublishingHouses') is not null or
   object_id('Cities') is not null or
   object_id('Streets') is not null or
   object_id('Stores') is not null or
   object_id('Books') is not null or
   object_id('Purchases') is not null or
   object_id('Sales') is not null  begin  
   rollback transaction
   
   print ''
   print '�� ��� ������� �������'
   print ''

   set noexec on;
end else begin
   commit transaction;
   
   print ''
   print '�������� ������ ���������'
   print ''
end;


begin transaction

-- �������� ������� ���������� �����������
create table AgeRestrictions (
     Id        int          not null identity(1, 1),  -- ��� ��������������
	 AgeRange nvarchar(4)   not null,                 -- ���������� �����������
	 
	 constraint AgeRestrictions_PK primary key (Id)
);
go

-- �������� ������� �����
create table Genres (
     Id        int          not null identity(1, 1),  -- ��� ��������������
	 GenreName nvarchar(50) not null,                 -- �������� ����� �����
	 
	 constraint Genres_PK primary key (Id)
);
go


-- �������� ������� ������
create table Authors (
     Id         int          not null identity(1, 1),  -- ��� ��������������
	 FirstName  nvarchar(50) not null,                 -- ��� ������
	 Surname    nvarchar(50) not null,                 -- ������� ������
	 Patronymic nvarchar(50) null,                     -- �������� ������
	 
	 constraint Authors_PK primary key (Id)
);
go


-- �������� ������� ������������
create table PublishingHouses (
     Id       int          not null identity(1, 1),  -- ��� ��������������
	 [Name]   nvarchar(50) not null,                 -- �������� ������������
	 Phone    nvarchar(15) not null,                 -- ���������� �����
	 
	 constraint PublishingHouses_PK primary key (Id)
);
go


-- �������� ������� ������
create table Cities (
     Id       int          not null identity(1, 1),  -- ��� ��������������
	 CityName nvarchar(50) not null,                 -- �������� ������
	 
	 constraint Cities_PK primary key (Id)
);
go


-- �������� ������� �����
create table Streets (
     Id        int           not null identity(1, 1),  -- ��� ��������������
	 StreetName nvarchar(50) not null,                 -- �������� �����
	 
	 constraint Streets_PK primary key (Id)
);
go


-- �������� ������� ��������
create table Stores (
     Id       int          not null identity(1, 1) constraint Stores_PK primary key (Id),  -- ��� ��������������
	 [Name]   nvarchar(50) not null,                 -- �������� ��������
	 IdCity   int          not null,                 -- ����� ����������
	 IdStreet int          not null,                 -- ����� ����������
	 HouseNum nvarchar(10) not null,                 -- ��� ����������
	 
	 -- ����� � �������� ������
	 constraint FK_Stores_Cities foreign key(IdCity) references dbo.Cities(Id),
	 -- ����� � �������� �����
	 constraint FK_Stores_Streets foreign key(IdStreet) references dbo.Streets(Id)
);
go


-- �������� ������� �����
create table Books (
     Id            int          not null identity(1, 1) constraint Books_PK primary key (Id),
	 Title         nvarchar(50) not null,                 -- �������� �����
	 IdAuthor      int          not null,                 -- �����
	 IdGenre       int          not null,                 -- ���� �����
	 IdHouse       int          not null,                 -- ������������ �����
	 IdAge         int          not null,                 -- ���������� �����������
	 Price         int          not null,                 -- ��������� �����
	 CreationYear  int          not null,                 -- ��� ������� �����

	 -- ���� �� ����� �� ����� ���� ������ 0
	 constraint Books_Price_check check (Price > 0),
	 -- ��� �������� ����� �� ����� ���� ������ �������� ���� ��� �������������
	 constraint Books_CreationYear_check check (CreationYear between 0 and Year(getdate())),
	 -- ����� � �������� ������
	 constraint FK_Books_Authors foreign key(IdAuthor) references dbo.Authors(Id),
	 -- ����� � �������� ������������
	 constraint FK_Books_PublishingHouses foreign key(IdHouse) references dbo.PublishingHouses(Id),
	 -- ����� � �������� ���������� �����������
	 constraint FK_Books_AgeRestrictions foreign key(IdAge) references dbo.AgeRestrictions(Id),
	 -- ����� � �������� �����
	 constraint FK_Books_Genres foreign key(IdGenre) references dbo.Genres(Id)
);
go


-- �������� ������� �������
create table Purchases (
     Id           int          not null identity(1, 1) constraint Purchases_PK primary key (Id),
	 IdStore      int  not null,         -- � ����� ������� ��������� �����
	 IdBook       int  not null,         -- ����� ����� ��������
	 PurchaseDate date not null,         -- ���� �������
	 Amount       int  not null,         -- ���������� ����������� ����
	 
	 -- ���� ������� �� ����� ���� ������ �������
	 constraint Purchases_PurchaseDate_check check (PurchaseDate < getdate()),	 
	 -- ���������� ���������� ���� �� ����� ���� �������������
	 constraint Purchases_Amount_check check (Amount > 0),
	 -- ����� � �������� ��������
	 constraint FK_Purchases_Stores foreign key(IdStore) references dbo.Stores(Id),
	 -- ����� � �������� �����
	 constraint FK_Purchases_Books foreign key(IdBook) references dbo.Books(Id)
);
go

-- �������� ������� �������
create table Sales (
     Id        int          not null identity(1, 1) constraint Sales_PK primary key (Id),
	 IdBook    int  not null,        -- ��������� �����
	 IdStore   int  not null,        -- � ����� �������� ������� �����
	 SaleDate  date not null,        -- ���� �������
	 Amount    int  not null,        -- ���������� ��������� ����
	 SalePrice int  not null,        -- ��������� ������� (�.�. ����� ����������� ��������� ��������)
	 
	 -- ���� ������� �� ����� ���� ������ �������
	 constraint Sales_SaleDate_check check (SaleDate < getdate()),	 
	 -- ���������� ���������� ���� �� ����� ���� �������������
	 constraint Sales_Amount_check check (Amount > 0),
	 -- ��������� ������� ���� �� ����� ���� �������������
	 constraint Sales_SalePrice_check check (SalePrice > 0),
	-- ����� � �������� �����
	 constraint FK_Sales_Books foreign key(IdBook) references dbo.Books(Id),
	-- ����� � �������� ��������
	 constraint FK_Sales_Stores foreign key(IdStore) references dbo.Stores(Id)
);
go


-- ���� �� ������� ���� �� ���� �������, ��������
-- ����������
if object_id('Genres') is null  or 
   object_id('AgeRestrictions') is null  or 
   object_id('Authors') is null  or 
   object_id('PublishingHouses') is null or
   object_id('Cities') is null or
   object_id('Streets') is null or
   object_id('Stores') is null or
   object_id('Books') is null or
   object_id('Purchases') is null or
   object_id('Sales') is null  begin  
   rollback transaction;
   print '';
   print '�� ��� ������� �������';
   print '';
   set noexec on;
end else
    commit transaction;

	
print '';
print '�������� ���� ������ � ������ ���������';
print '';