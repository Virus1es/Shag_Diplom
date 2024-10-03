import React, {useEffect, useState} from 'react';
import {Tag} from "primereact/tag";
import {Rating} from "primereact/rating";

// получить данные по url
export async function GetArrayByUrl(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json(); // Преобразуем ответ в JSON
        return data; // Возвращаем полученные данные
    } catch (error) {
        console.error('Error fetching data from URL:', error);
        throw error; // Пробрасываем ошибку дальше, чтобы ее можно было обработать в вызывающем коде
    }
}

// получить данные по url
export function PostBooksWithHeaders(url, searchType, value, navigateFunc, navTo){
    // XNLHttpRequest это и есть реализация AJAX в JavaScript
    let request = new XMLHttpRequest();

    // настройка и отправка AJAX-запроса на сервер
    // request.open("POST", `http://localhost:4242/people/post/${id}/${fullName}/${age}`);
    // "http://localhost:5257/books/search"
    request.open("POST", url);

    // передача на сервер в параметрах формы
    let body = new FormData();
    body.append("type", searchType);
    body.append(searchType, value);

    // callBack, работающий по окончании запроса
    request.onload = function () {
        // если запрос завершен и завершен корректно вывести полученные от сервера данные
        if (request.status >= 200 && request.status <= 399) {
            let books = JSON.parse(request.responseText);
            navTo === '/book' ? localStorage.setItem('book', JSON.stringify(books))
                : localStorage.setItem('books', JSON.stringify(books));
            navigateFunc(navTo);
        } // if
    } // callBack

    // собственно отправка запроса
    request.send(body);
}

// функция проверяющая есть ли у автора отчество
// и в зависимости от этого возвращающая первую букву его отчества с точкой (если отчество есть)
// иначе возвращает пустую строку
export function checkPatronymic(patronymic) {
    return (patronymic !== "") ? patronymic[0] + "." : '';
}

export function PrintBookCard(book, navFunc){
    return (
        <div className="book-card"
             onClick={(event) =>  {
                 PostBooksWithHeaders("http://localhost:5257/books/search","id", book.id, navFunc, '/book')
             }}>
            <div className="content-wrapper">
                <img src={require('./img/books/' + book.bookImage)}
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
                        <span className="book-voters" style={{color: "black"}}>Оценок: {book.amountRatings} </span>
                    </div>
                    <div className="book-sum card-sum">
                        {book.bookDescription}
                    </div>
                </div>
            </div>
            <div className="likes">
                <div className="like-name">
                    <span>Цена: </span> {book.price.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'})}
                </div>
            </div>
        </div>
    )
}