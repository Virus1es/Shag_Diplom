import React, {useEffect, useState} from 'react';
import '../index.css';
import { Carousel } from 'primereact/carousel';
import {checkPatronymic, GetArrayByUrl, PostBooksWithHeaders, PrintBookCard} from "../utils";
import {Tag} from 'primereact/tag';
import {Rating} from "primereact/rating";
import { Chip } from 'primereact/chip';
import {useNavigate} from "react-router-dom";


const flickityOptions = {
    initialIndex: 0,
    wrapAround: true,
    autoPlay: true
};

// вывод книг в верхней части экрана
// м.б. будут новинки
// вывод карусели книг
function MyCarousel() {
    // почему-то если убрать это Flickity перестаёт нормально работать
    const [books, setBooks] = useState([]);
    // используется для redirect в коде
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let getBooks = await GetArrayByUrl('http://localhost:5257/books/get');
                setBooks(getBooks.slice(0, 5));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

// Функция для рендеринга каждого элемента книги
    const bookTemplate = (book) => {
        const backgroundColor = book.id % 2 === 0 ? '#fbadaf' : '#cbb5e2'; // Чередуем цвета

        return (
            <div className="book-cell" key={book.id} style={{width: '680px', height: '350px', backgroundColor}}>
                <div className="book-img">
                    <img src={require('../img/books/' + book.bookImage)} alt={book.title} className="book-photo" />
                </div>
                <div className="book-content">
                    <div className="book-title">{book.title}</div>
                    <div className="book-author">
                        {book.idAuthorNavigation.surname} {book.idAuthorNavigation.firstName[0]}. {checkPatronymic(book.idAuthorNavigation.patronymic)}
                    </div>
                    <div className="genre-tag">
                        <Tag severity="info" value={book.idGenreNavigation.genreName} rounded></Tag>
                    </div>
                    <div className="rate">
                        <div className="stars">
                            <Rating value={book.rating}
                                    readOnly
                                    cancel={false}
                                    tooltip={"Текущая оценка: " + book.rating.toFixed(2)}
                                    tooltipOptions={{ mouseTrack: true, style: { fontSize: 14 } }} />
                        </div>
                        <span className="book-voters">Оценок: {book.amountRatings} </span>
                    </div>
                    <div className="book-sum">
                        {book.bookDescription}
                    </div>
                    <div className="book-see"
                         onClick={() => { PostBooksWithHeaders("http://localhost:5257/books/search", "id", book.id, navigate, '/book') }}>
                        Подробнее
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="book-slide">
            <Carousel value={books}
                      circular
                      autoplayInterval={3000}
                      showIndicators={false}
                      itemTemplate={bookTemplate}
                      numVisible={2}
                      numScroll={1} />
        </div>
    );
}

// вывод популярных книг в определённом жанре или из всех жанров
function ShowBooksByGenre() {
    // используется для redirect в коде
    const navigate = useNavigate();

    // получение книг с сервера
    const [booksfor, setBooksFor] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setBooksFor(await GetArrayByUrl('http://localhost:5257/books/get'));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // заполнение массива разметкой
    return (booksfor.map((book) =>
        <div>
            {PrintBookCard(book, navigate)}
        </div>
    ))
}

// вывод популярных авторов этой недели
function ShowWeekAuthors() {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setAuthors(await GetArrayByUrl('http://localhost:5257/authors/popular'));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // не выводим больше 5 авторов
    if (authors.length > 5) setAuthors(authors.slice(0, 5));

    // заполнение массива разметкой
    return (authors.map((author) => {
            let str = author.surname + ' ' + author.firstName[0] + '. ' + checkPatronymic(author.patronymic);

            return (
                <div className="author">
                    <Chip label={str}/>
                </div>
            );
        })
    )
}

// вывод книг популярных в этом году
function ShowYearBooks() {
    // используется для redirect в коде
    const navigate = useNavigate();

    const [booksPop, setBooksPop] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let books = await GetArrayByUrl('http://localhost:5257/books/popular');
                setBooksPop(books.slice(0, 5));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // заполнение массива разметкой
    return (booksPop.map((book) => {
        return (
            <div className="year-book"
                 onClick={() => {PostBooksWithHeaders("http://localhost:5257/books/search",
                                                     "id", book.id, navigate, '/book')}}
            >
                <img src={require('../img/books/' + book.bookImage)}
                     alt={book.title}
                     className="year-book-img"/>
                <div className="year-book-content">
                    <div className="year-book-name">{book.title}</div>
                    <div className="year-book-author">
                        {book.surname} {book.firstName[0]}. {checkPatronymic(book.patronymic)}
                    </div>
                </div>
            </div>
        )
    })
    )
}


export function CatchUser(){
    // XNLHttpRequest это и есть реализация AJAX в JavaScript
    let request = new XMLHttpRequest();

    // настройка и отправка AJAX-запроса на сервер
    // request.open("POST", `http://localhost:4242/people/post/${id}/${fullName}/${age}`);
    // "http://localhost:5257/books/search"
    request.open("GET", 'http://localhost:5257/users/getuser');

    // передача на сервер в параметрах формы
    // let body = new FormData();
    // body.append("username", 'username');

    // callBack, работающий по окончании запроса
    request.onload = function () {
        // если запрос завершен и завершен корректно вывести полученные от сервера данные
        if (request.status >= 200 && request.status <= 399) {
            let text = JSON.parse(request.responseText);
        } // if
    } // callBack

    // собственно отправка запроса
    request.send();
}

export default function Home(){
    CatchUser();

    return (
        <div className="book-store">
            <MyCarousel/>

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
                            <a href="#" className="book-type active">Все книги</a>
                        </div>
                    </div>
                    <div className="book-cards">
                        <ShowBooksByGenre/>
                    </div>
                </div>
            </div>
        </div>
    )
}