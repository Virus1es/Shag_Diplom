import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Flickity from "react-flickity-component";
const flickityOptions = {
    initialIndex: 2,
    wrapAround: true
}

// получить данные по url
function getArrayByUrl(url){
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [values, setBooks] = useState([]);

    // получение данных с сервера о книгах
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        fetch(url)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setBooks(data);
            });
    }, []);

    return values;
}

// вывод книг в верхней части экрана
// м.б. будут новинки
function ShowUpperBooks() {
    // получение книг с сервера
    let books = getArrayByUrl('http://localhost:5257/books/get');

    return (books.slice(0, 5).map((book) => { return(
            <div className="book-cell">
                <div className="book-img">
                    <img src={require('./img/books/' + book.bookImage)}
                         alt={book.title}
                         className="book-photo"/>
                </div>
                <div className="book-content">
                    <div className="book-title">{book.title}</div>
                    <div className="book-author">{book.idAuthorNavigation.surname}</div>
                    <div className="book-author">{book.idGenreNavigation.genreName}</div>
                    <div className="rate">
                        <fieldset className="rating yellow">
                            <input type="checkbox" id={"star" + (book.id + 5).toString()} name="rating"
                                   value="5"/>
                            <label className="full" htmlFor={"star" + (book.id + 5).toString()}></label>
                            <input type="checkbox" id={"star" + (book.id + 4).toString()} name="rating"
                                   value="4"/>
                            <label className="full" htmlFor={"star" + (book.id + 4).toString()}></label>
                            <input type="checkbox" id={"star" + (book.id + 3).toString()} name="rating"
                                   value="3"/>
                            <label className="full" htmlFor={"star" + (book.id + 3).toString()}></label>
                            <input type="checkbox" id={"star" + (book.id + 2).toString()} name="rating"
                                   value="2"/>
                            <label className="full" htmlFor={"star" + (book.id + 2).toString()}></label>
                            <input type="checkbox" id={"star" + (book.id + 1).toString()} name="rating"
                                   value="1"/>
                            <label className="full" htmlFor={"star" + (book.id + 1).toString()}></label>
                        </fieldset>
                        <span className="book-voters">Оценок: {book.amountRatings} </span>
                    </div>
                    <div className="book-sum">
                        {book.bookDescription}
                    </div>
                    <div className="book-see">Подробнее</div>
                </div>
            </div>
        )}
    ))
}

// вывод карусели книг
function Carousel() {
    let books = getArrayByUrl('http://localhost:5257/books/get');
    console.log("||||||||||||||||");
    console.log(books);
    return (
        <div className="book-slide">
            <Flickity
                className={'book'} // default ''
                elementType={'div'} // default 'div'
                options={flickityOptions} // takes flickity options {}
                disableImagesLoaded={false} // default false
                reloadOnUpdate // default false
                static // default false
            >
                <ShowUpperBooks/>
            </Flickity>
        </div>
    )
}

// вывод популярных книг в определённом жанре или из всех жанров
function ShowBooksByGenre() {
    // получение книг с сервера
    let books = getArrayByUrl('http://localhost:5257/books/get');

    // заполнение массива разметкой
    return (books.map((book) => { return(
            <div className="book-card">
                <div className="content-wrapper">
                    <img src={require('./img/books/' + book.bookImage)}
                         alt={book.title}
                         className="book-card-img"/>
                    <div className="card-content">
                        <div className="book-name">{book.title}</div>
                        <div className="book-by">{book.idAuthorNavigation.surname}</div>
                        <div className="book-by">{book.idGenreNavigation.genreName}</div>
                        <div className="rate">
                            <fieldset className="rating book-rate">
                                <input type="checkbox" id={"star-c" + (book.id + 5).toString()} name="rating" value="5"/>
                                <label className="full" htmlFor={"star-c" + (book.id + 5).toString()}></label>
                                <input type="checkbox" id={"star-c" + (book.id + 4).toString()} name="rating" value="4"/>
                                <label className="full" htmlFor={"star-c" + (book.id + 4).toString()}></label>
                                <input type="checkbox" id={"star-c" + (book.id + 3).toString()} name="rating" value="3"/>
                                <label className="full" htmlFor={"star-c" + (book.id + 3).toString()}></label>
                                <input type="checkbox" id={"star-c" + (book.id + 2).toString()} name="rating" value="2"/>
                                <label className="full" htmlFor={"star-c" + (book.id + 2).toString()}></label>
                                <input type="checkbox" id={"star-c" + (book.id + 1).toString()} name="rating" value="1"/>
                                <label className="full" htmlFor={"star-c" + (book.id + 1).toString()}></label>
                            </fieldset>
                            <span className="book-voters card-vote">Оценок: {book.amountRatings}</span>
                        </div>
                        <div className="book-sum card-sum">
                            {book.bookDescription}
                        </div>
                    </div>
                </div>
                <div className="likes">
                    <div className="like-name">Текущая оценка: <span>{book.rating.toFixed(2)}</span></div>
                </div>
            </div>
        )}
    ))
}

// вывод популярных авторов этой недели
function ShowWeekAuthors() {
    let str = [];

    for (let i = 0; i < 5; i++) {
        str.push(
            <div className="author">
                <img
                    src={require('./img/authors/dostoevskiiFM.jpg')}
                    alt="Достоевский Ф.М." className="author-img"/>
                <div className="author-name">Достоевский Ф.М.</div>
            </div>
        );
    }

    return str;
}

// вывод книг популярных в этом году
function ShowYearBooks() {
    let str = [];

    for (let i = 0; i < 5; i++) {
        str.push(
            <div className="year-book">
                <img src={require('./img/books/dostoevskii_nakazanie.jpg')}
                     alt="Преступление и наказание"
                     className="year-book-img"/>
                <div className="year-book-content">
                    <div className="year-book-name">Преступление и наказание</div>
                    <div className="year-book-author">Достоевский Ф.М.</div>
                </div>
            </div>
        );
    }

    return str;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div className="book-store">
        <div className="header">
            <div className="browse">
                <div className="browse-category">
                    Книги по жанру
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="feather feather-chevron-down">
                        <path d="M6 9l6 6 6-6"/>
                    </svg>
                </div>
                <div className="search-bar">
                    <label>
                        <input type="text" placeholder="Найти книгу"/>
                    </label>
                </div>
            </div>
            <div className="header-title">Прочти<span>ка</span></div>
            <div className="profile">
                <div className="user-profile">
                    <img src="https://randomuser.me/api/portraits/women/63.jpg" alt="" className="user-img"/>
                </div>
                <div className="profile-menu">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="feather feather-menu">
                        <path d="M3 12h18M3 6h18M3 18h18"/>
                    </svg>
                    Меню
                </div>
            </div>
        </div>

        <Carousel/>

        <React.StrictMode>
            <App/>
        </React.StrictMode>

        <div className="main-wrapper">
            <div className="books-of">
                <div className="week">
                    <div className="author-title">Авторы недели</div>
                    <ShowWeekAuthors/>
                </div>
                <div className="week year">
                    <div className="author-title">Популярные книги</div>
                    <ShowYearBooks/>
                </div>
                <div className="overlay"></div>
            </div>
            <div className="popular-books">
                <div className="main-menu">
                    <div className="genre">Подборки книг</div>
                    <div className="book-types">
                        <a href="#" className="book-type active">Набирающие популярность</a>
                        <a href="#" className="book-type">Бестселлеры жанра</a>
                        <a href="#" className="book-type">Выбор редакции</a>
                        <a href="#" className="book-type">Классика</a>
                        <a href="#" className="book-type">Philosophy</a>
                        <a href="#" className="book-type">Biography</a>
                    </div>
                </div>
                <div className="book-cards">
                    <ShowBooksByGenre/>
                </div>
            </div>
        </div>
    </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
