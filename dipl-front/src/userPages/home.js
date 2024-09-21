import React, {useContext, useEffect} from 'react';
import '../index.css';
import Flickity from "react-flickity-component";
import {checkPatronymic, GetArrayByUrl, PostBooksWithHeaders, PrintBookCard} from "../utils";
import {Tag} from 'primereact/tag';
import {Rating} from "primereact/rating";
import { Chip } from 'primereact/chip';
import {BooksContext} from "../Context";
import {useNavigate} from "react-router-dom";


const flickityOptions = {
    initialIndex: 2,
    wrapAround: true
}

// вывод книг в верхней части экрана
// м.б. будут новинки
function ShowUpperBooks() {
    // получаем функцию присвоения книг в контекст
    const {books,  searchBooks } = useContext(BooksContext);
    // используется для redirect в коде
    const navigate = useNavigate();

    // получение книг с сервера
    let booksUp = GetArrayByUrl('http://localhost:5257/books/get');

    useEffect(() => {
        if(books.length !== 0) navigate('/book');
    }, [books]);

    return (booksUp.slice(0, 5).map((book) => {
            return (
                <div className="book-cell">
                    <div className="book-img">
                        <img src={require('../img/books/' + book.bookImage)}
                             alt={book.title}
                             className="book-photo"/>
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
                                        tooltipOptions={{ mouseTrack: true, style: {fontSize: 14} }}/>
                            </div>
                            <span className="book-voters">Оценок: {book.amountRatings} </span>
                        </div>
                        <div className="book-sum">
                            {book.bookDescription}
                        </div>
                        <div className="book-see"
                             onClick={() =>  {PostBooksWithHeaders("http://localhost:5257/books/search",
                                                                   "id", book.id, searchBooks)}}>
                            Подробнее
                        </div>
                    </div>
                </div>
            )
        }
    ))
}

// вывод карусели книг
function MyCarousel() {
    // почему-то если убрать это Flickity перестаёт нормально работать
    let books = GetArrayByUrl('http://localhost:5257/books/get');
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

/*
<fieldset className="rating yellow">
    <input type="checkbox" id={"star" + (book.id * 5 + 5).toString()} name="rating"
           value="5"/>
    <label className="full" htmlFor={"star" + (book.id * 5 + 5).toString()}></label>
    <input type="checkbox" id={"star" + (book.id * 5 + 4).toString()} name="rating"
           value="4"/>
    <label className="full" htmlFor={"star" + (book.id * 5 + 4).toString()}></label>
    <input type="checkbox" id={"star" + (book.id * 5 + 3).toString()} name="rating"
           value="3"/>
    <label className="full" htmlFor={"star" + (book.id * 5 + 3).toString()}></label>
    <input type="checkbox" id={"star" + (book.id * 5 + 2).toString()} name="rating"
           value="2"/>
    <label className="full" htmlFor={"star" + (book.id * 5 + 2).toString()}></label>
    <input type="checkbox" id={"star" + (book.id * 5 + 1).toString()} name="rating"
           value="1"/>
    <label className="full" htmlFor={"star" + (book.id * 5 + 1).toString()}></label>
</fieldset>
*/

// вывод популярных книг в определённом жанре или из всех жанров
function ShowBooksByGenre() {
    // получаем функцию присвоения книг в контекст
    const {books,  searchBooks } = useContext(BooksContext);
    // используется для redirect в коде
    const navigate = useNavigate();

    // получение книг с сервера
    const booksfor = GetArrayByUrl('http://localhost:5257/books/get');

    useEffect(() => {
        if(books.length !== 0) navigate('/book');
    }, [books]);

    // заполнение массива разметкой
    return (booksfor.map((book) =>
        <div onClick={() => PostBooksWithHeaders("http://localhost:5257/books/search",
                                                 "id", book.id, searchBooks)}>
            {PrintBookCard(book)}
        </div>
    ))
}

// вывод популярных авторов этой недели
function ShowWeekAuthors() {
    let authors = GetArrayByUrl('http://localhost:5257/authors/popular');

    // не выводим больше 5 авторов
    if (authors.length > 5) authors = authors.slice(0, 5);

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
    // получаем функцию присвоения книг в контекст
    const {books,  searchBooks } = useContext(BooksContext);
    // используется для redirect в коде
    const navigate = useNavigate();

    let booksPop = GetArrayByUrl('http://localhost:5257/books/popular').slice(0, 5);

    useEffect(() => {
        if(books.length !== 0) navigate('/book');
    }, [books]);

    // заполнение массива разметкой
    return (booksPop.map((book) => {
        return (
            <div className="year-book"
                 onClick={() => {PostBooksWithHeaders("http://localhost:5257/books/search",
                                                     "id", book.id, searchBooks); console.log("Пытаюсь!")}}
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
            console.log(text);
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
                            <a href="#" className="book-type">Бестселлеры жанра</a>
                            <a href="#" className="book-type">Набирающие популярность</a>
                            <a href="#" className="book-type">Классика</a>
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