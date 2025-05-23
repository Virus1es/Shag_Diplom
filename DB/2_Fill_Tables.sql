use Diploming_DB;
go

-- Заполнение таблицы Города
begin transaction        
insert into Cities(CityName) 
values
    ('Донецк'),          -- 1
    ('Харцизск'),        -- 2
    ('Докучаевск'),      -- 3
    ('Санкт-Питербург'), -- 4
    ('Макеевка'),        -- 5
    ('Еленовка'),        -- 6
    ('Шахтёрск'),        -- 7
    ('Снежное'),         -- 8
    ('Горловка'),        -- 9
    ('Новоазовск'),      -- 10
    ('Мариуполь'),       -- 11
    ('Волноваха'),       -- 12
    ('Торез'),           -- 13
    ('Амвросиевка'),     -- 14
    ('Ростов-на-Дону'),  -- 15
    ('Екатеренбург'),    -- 16
    ('Москва'),          -- 17
    ('Омск'),            -- 18
    ('Владивосток'),     -- 19
	('Телманово');       -- 20
commit transaction;

-- Заполнение таблицы Возрастные ограничения
begin transaction        
insert into AgeRestrictions(AgeRange) 
values
    ('0+'),  -- 1
    ('6+'),  -- 2
    ('12+'), -- 3
    ('16+'), -- 4
    ('18+'); -- 5
commit transaction;

-- Заполнение таблицы Издательства
begin transaction        
insert into PublishingHouses([Name], Phone, AddPercent) 
values
	('РосИздательство', '+79493129311',  5.5), -- 1
	('Астарот',         '+79713587123',  6.0), -- 2
	('Кристал',         '+79493754891', 12.5), -- 3
	('Мнемосина',       '+79013758374',  9.5), -- 4
	('Клио',            '+79835673928',  5.5), -- 5
	('Друг писателя',   '+79333758247', 15.5), -- 6
	('Каллиопа',        '+79490023832',  5.0), -- 7
	('Талия',           '+79034802481',  3.5), -- 8
	('Бард',            '+79425792812',  7.5), -- 9
	('Эвтерпа',         '+79578122812',  7.0); -- 10
commit transaction;

-- Заполнение таблицы Поставщики
begin transaction        
insert into Providers([Name], Phone) 
values
	('ДонТранзит',  '+79590131779'), -- 1
	('Перевезём',   '+79184195847'), -- 2
	('Гермес',      '+79875052548'), -- 3
	('РосДоставка', '+79856590322'), -- 4
	('ПромТранз',   '+79914597813'), -- 5
	('Фуразиол',    '+79479293801'), -- 6
	('Пряник',      '+79956713820'), -- 7
	('Тропил',      '+79593264737'), -- 8
	('ПромТранзит', '+79517097211'), -- 9
	('Особый',      '+79437818294'); -- 10
commit transaction;

-- Заполнение таблицы Авторы
begin transaction        
insert into Authors(Surname, FirstName, Patronymic) 
values
    ('Пушкин',      'Александр',    'Сергеевич'),  -- 1
    ('Достаевский', 'Фёдор',        'Михайлович'), -- 2
    ('Толстой',     'Лев',          'Николаевич'), -- 3
    ('Гоголь',      'Николай',      'Васильевич'), -- 4
    ('Алигьери',    'Данте',        ''),           -- 5
    ('Пришвин',     'Михаил ',      'Михайлович'), -- 6
    ('Глуховский',  'Дмитрий',      'Алексеевич'), -- 7
    ('Сапковский',  'Анджей',       ''),           -- 8
    ('Сэлинджер',   'Джером Дэвид', ''),           -- 9
    ('Роулинг',     'Джоан',        ''),           -- 10
    ('Кинг',        'Стивен',       '');           -- 11
commit transaction;

-- Заполнение таблицы Жанры
begin transaction        
insert into Genres(GenreName) 
values
    ('фантастика'),         -- 1
    ('ужасы'),              -- 2
    ('комедия'),            -- 3
    ('драмма'),             -- 4
    ('трагдия'),            -- 5
    ('фентези'),            -- 6
    ('научная фантастика'), -- 7
    ('детектив'),           -- 8
    ('биография'),          -- 9
    ('поэзия'),             -- 10
    ('сказка'),             -- 11
    ('историческая'),       -- 12
    ('роман'),              -- 13
    ('постапокалиптика'),   -- 14
    ('триллер'),            -- 15
    ('поэма'),              -- 16
    ('научная');            -- 17
commit transaction;

-- Заполнение таблицы Улицы
begin transaction        
insert into Streets(StreetName) 
values
    ('Ленина'),        -- 1
    ('Центральная'),   -- 2
    ('Мира'),          -- 3
    ('Ватутина'),      -- 4
    ('Октябрьская'),   -- 5
    ('Островского'),   -- 6
    ('Пушкина'),       -- 7
    ('Комсомольская'), -- 8
    ('Лихолетова'),    -- 9
    ('Щорса'),         -- 10
    ('Советская');     -- 11
commit transaction;

-- Заполнение таблицы Магазины
begin transaction        
insert into Stores([Name], IdCity, IdStreet, HouseNum) 
values
    ('Книжный червь',    5, 4, '2А'),   -- 1
    ('Колейдоскоп',      1, 1, '3/1'),  -- 2
    ('Гранит',           8, 9, '113'),  -- 3
    ('Журнальный стол', 11, 6, '14'),   -- 4
    ('Афина',            1, 3, '7'),    -- 5
    ('Книгоман',         6, 5, '1'),    -- 6
    ('Литера',          16, 8, '411'),  -- 7
    ('Листок',           9, 2, '117А'), -- 8
    ('Bookва',           3, 7, '31'),   -- 9
    ('Минерва',         16, 3, '31/6'); -- 10
commit transaction;

-- Заполнение таблицы Книги
begin transaction        
insert into Books(Title, BookImage, IdAuthor, IdGenre, IdAge, Price, CreationYear, AmountRatings, Rating, BookDescription, IsDelete) 
values
    ('Анна Коренина',                     'tolstoi_korenina.jpg',      3, 13, 4, 3000, 1830, 0, 0.0, 'Роман о трагической любви замужней дамы Анны Карениной и блестящего офицера Алексея Вронского', 0),    -- 1
    ('Евгений Онегин',                    'pushlin_onegin.jpg',        1, 13, 4, 3000, 1830, 0, 0.0, 'Одно из самых значимых произведений русской литературы' , 0),    -- 2
    ('Над пропастью во ржи',              'selidjer_roj.jpg',          9, 13, 4, 1800, 1951, 0, 0.0, 'От лица 17-летнего юноши по имени Холден Колфилд откровенно рассказывается о его обострённом восприятии американской действительности', 0),    -- 3
    ('Преступление и наказание',          'dostoevskii_nakazanie.jpg', 2, 13, 3, 3500, 1866, 0, 0.0, 'Социально-психологический и социально-философский роман.', 0),    -- 4
    ('Война и мир',                       'tolstoi_mir.jpg',           3, 13, 4, 3010, 1873, 0, 0.0, 'В романе рассказывается о французском вторжении в Россию и влиянии наполеоновской эпохи на царское общество через истории пяти русских аристократических семей.', 0),    -- 5
    ('Метро 2033',                        'glukhovskii_metro.jpg',     7, 14, 5, 2700, 2005, 0, 0.0, 'Постапокалиптический роман Дмитрия Глуховского, описывающий жизнь людей в московском метро после ядерной войны на Земле.', 0),    -- 6
    ('Ведьмак. Последнее желание',        'sapkovskii_vedmak.jpg',     8,  6, 4, 3000, 1986, 0, 0.0, 'Сборник рассказов писателя Анджея Сапковского в жанре фэнтези, объединённых общим персонажем — ведьмаком Геральтом из Ривии.', 0),    -- 7
    ('Гарри Поттер и философский камень', 'rouling_potter.jpg',       10,  6, 2, 1800, 1995, 0, 0.0, 'Фэнтезийный роман британской писательницы Джоан Роулинг. Первая часть в серии книг о Гарри Поттере и дебютный роман Роулинг.', 0),    -- 8
    ('Оно',                               'king_ono.jpg',             11,  2, 4, 3500, 1986, 0, 0.0, 'Роман американского писателя. В произведении затрагиваются важные для Кинга темы: власть памяти, сила объединённой группы и влияние детских психологических травм на взрослую жизнь. ', 0),    -- 9
    ('Божественная комедия',              'olegeri_komedia.jpg',       5, 16, 3, 3010, 1321, 0, 0.0, 'Поэма, написанная Данте Алигьери в период приблизительно с 1308 по 1321 год и дающая наиболее широкий синтез средневековой культуры и онтологии мира. ', 0),    -- 10
    ('11/22/63',                          'king_112263.jpg',          11,  1, 4, 2700, 2011, 0, 0.0, 'Научно-фантастический роман американского писателя Стивена Кинга, рассказывающий о путешественнике во времени, пытающемся предотвратить убийство 35-го президента США Джона Кеннеди.', 0);    -- 11
commit transaction;

-- Заполнение таблицы Книги с издательствами
begin transaction        
insert into PubBooks(IdBook, IdHouse) 
values
    ( 2, 4),    -- 1
    ( 1, 4),    -- 2
    ( 5, 3),    -- 3
    ( 4, 4),    -- 4
    ( 8, 5),    -- 5
    ( 8, 4),    -- 6
    ( 2, 2),    -- 7
    ( 9, 4),    -- 8
    ( 3, 3),    -- 9
    (10, 4);    -- 10
commit transaction;

-- Заполнение таблицы Закупки
begin transaction        
insert into Purchases(IdProvider, IdPubBook, PurchaseDate, Amount, PurchasePrice) 
values
    ( 5,  6, '2023-11-10',  30, 45500),    -- 1
    ( 9,  9, '2024-03-11',   6, 21700),    -- 2
    ( 2,  1, '2023-10-20',  36, 53000),    -- 3
    (10,  7, '2024-05-14',  33, 55500),    -- 4
    (10, 10, '2024-01-23',  48, 67800),    -- 5
    ( 6,  9, '2024-04-04',  30, 46000),    -- 6
    ( 6,  7, '2023-11-01',   6, 15600),    -- 7
    ( 4,  8, '2023-08-08',  31, 46000),    -- 8
    ( 6,  6, '2024-04-01',  38, 49900),    -- 9
    ( 1,  6, '2023-09-28',  15, 31000),    -- 10
    ( 6,  9, '2023-09-23',  21, 35000),    -- 11
    ( 2,  8, '2023-11-27',  29, 39900),    -- 12
    ( 6,  1, '2024-04-16',  39, 51200),    -- 13
    ( 8,  7, '2024-05-10',  49, 59800),    -- 14
    ( 5,  7, '2023-08-21',  35, 33000),    -- 15
    ( 6,  6, '2024-04-15',   5, 11000),    -- 16
    ( 4,  9, '2023-07-28',  46, 62000),    -- 17
    ( 6,  2, '2023-10-10',  35, 41000),    -- 18
    ( 5,  1, '2024-02-07',  42, 46000),    -- 19
	( 2,  2, '2023-11-20',  40, 56000),    -- 20
	( 6,  6, '2023-09-23', 100, 85000),    -- 21
    ( 3,  8, '2024-03-18',  30, 35800);    -- 22
commit transaction;

-- Заполнение таблицы Продажи
begin transaction        
insert into Sales(IdPubBook, SaleDate, Amount, SalePrice, DeliverPrice) 
values
    (6, '2024-03-03', 12, 12500, 700),    -- 1
    (5, '2024-06-26',  1,  3000, 200),    -- 2
    (3, '2024-05-21', 20, 21000,  50),    -- 3
    (6, '2024-06-20', 39, 40000, 100),    -- 4
    (2, '2024-05-27',  3,  9000, 100),    -- 5
    (6, '2024-04-07', 21, 21500, 400),    -- 6
    (6, '2024-05-04', 50, 55000, 300),    -- 7
    (9, '2024-04-08', 28, 28700, 200),    -- 8
    (6, '2024-03-26',  7, 14000, 100),    -- 9
    (5, '2024-04-04', 23, 23300, 200),    -- 10
    (1, '2024-06-26', 14, 14500, 700),    -- 11
    (8, '2024-04-05', 24, 24900, 700),    -- 12
    (6, '2024-04-09', 14, 14250, 200),    -- 13
    (2, '2024-04-23', 21, 21600, 400),    -- 14
    (6, '2024-06-25', 42, 42300, 200),    -- 15
    (2, '2024-06-15', 45, 46050, 200),    -- 16
    (4, '2024-04-22', 24, 25000, 500),    -- 17
    (2, '2024-06-22',  2,  6700, 100),    -- 18
    (8, '2024-06-16', 30, 33000, 500),    -- 19
    (8, '2024-05-17', 28, 30000, 100);    -- 20
commit transaction;

begin transaction        
insert into Sales(IdPubBook, SaleDate, Amount, SalePrice, DeliverPrice) 
values
    (6, '2024-09-03', 12, 12500, 700),    -- 1
    (5, '2024-10-15',  1,  3000, 200),    -- 2
    (3, '2024-10-16', 20, 21000,  50),    -- 3
    (6, '2024-09-19', 39, 40000, 100),    -- 4
    (2, '2024-09-27',  3,  9000, 100),    -- 5
    (6, '2024-09-07', 21, 21500, 400),    -- 6
    (6, '2024-09-04', 50, 55000, 300),    -- 7
    (9, '2024-09-08', 28, 28700, 200),    -- 8
    (6, '2024-09-26',  7, 14000, 100),    -- 9
    (5, '2024-09-07', 23, 23300, 200),    -- 10
    (1, '2024-09-25', 14, 14500, 700),    -- 11
    (8, '2024-10-05', 24, 24900, 700),    -- 12
    (6, '2024-10-09', 14, 14250, 200),    -- 13
    (2, '2024-10-15', 21, 21600, 400),    -- 14
    (6, '2024-10-11', 42, 42300, 200),    -- 15
    (2, '2024-09-15', 45, 46050, 200),    -- 16
    (4, '2024-10-06', 24, 25000, 500),    -- 17
    (2, '2024-10-02',  2,  6700, 100),    -- 18
    (8, '2024-10-16', 30, 33000, 500),    -- 19
    (8, '2024-10-17', 28, 30000, 100);    -- 20
commit transaction;
