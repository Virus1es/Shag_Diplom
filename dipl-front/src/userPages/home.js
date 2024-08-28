import React, {StrictMode} from 'react';
import '../index.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import App from '../App';
import Flickity from "react-flickity-component";
import {checkPatronymic, GetArrayByUrl} from "../utils";
import {Tag} from 'primereact/tag';
import {Rating} from "primereact/rating";
import { Chip } from 'primereact/chip';


const flickityOptions = {
    initialIndex: 2,
    wrapAround: true
}

// вывод книг в верхней части экрана
// м.б. будут новинки
function ShowUpperBooks() {
    // получение книг с сервера
    let books = GetArrayByUrl('http://localhost:5257/books/get');

    return (books.slice(0, 5).map((book) => {
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
                        <div className="book-see">Подробнее</div>
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
    // получение книг с сервера
    let books = GetArrayByUrl('http://localhost:5257/books/get');

    // заполнение массива разметкой
    return (books.map((book) => {
            return (
                <div className="book-card">
                    <div className="content-wrapper">
                        <img src={require('../img/books/' + book.bookImage)}
                             alt={book.title}
                             className="book-card-img"/>
                        <div className="card-content">
                            <div className="book-name">{book.title}</div>
                            <div className="book-by">
                                {book.idAuthorNavigation.firstName} {book.idAuthorNavigation.patronymic} {book.idAuthorNavigation.surname}
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
                                            tooltipOptions={{mouseTrack: true, style: {fontSize: 14}}}/>
                                </div>
                                <span className="book-voters">Оценок: {book.amountRatings} </span>
                            </div>
                            <div className="book-sum card-sum">
                                {book.bookDescription}
                            </div>
                        </div>
                    </div>
                    <div className="likes">
                        <div className="like-name">
                            <span>Цена: </span> {book.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                        </div>
                    </div>
                </div>
            )
        }
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
    let books = GetArrayByUrl('http://localhost:5257/books/popular').slice(0, 5);

    // заполнение массива разметкой
    return (books.map((book) => {
        return (
            <div className="year-book">
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

export default function Home(){
    return (
        <div className="book-store">
            <StrictMode>
                <App/>
            </StrictMode>

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
                            <a href="#" className="book-type active">Набирающие популярность</a>
                            <a href="#" className="book-type">Бестселлеры жанра</a>
                            <a href="#" className="book-type">Выбор редакции</a>
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